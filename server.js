import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import QRCode from 'qrcode';
import { createHmac } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const maxAge = 30 * 60 * 1000;
const rooms = new Map();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

function iceServers() {
  const servers = [{ urls: 'stun:stun.l.google.com:19302' }];
  const urls = (process.env.TURN_URLS || '').split(',').map(v => v.trim()).filter(v => /^turns?:[^\s]+$/i.test(v));
  if (urls.length && process.env.TURN_SECRET) {
    const username = `${Math.floor(Date.now() / 1000) + 3600}:blinksend`;
    const credential = createHmac('sha1', process.env.TURN_SECRET).update(username).digest('base64');
    servers.push({ urls, username, credential });
  }
  return servers;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ status: 'ok' })); return;
    }
    if (pathname === '/ice') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
      res.end(JSON.stringify({ iceServers: iceServers() })); return;
    }
    if (pathname === '/qr') {
      const value = new URL(req.url, 'http://localhost').searchParams.get('url') || '';
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.host !== req.headers.host || parsed.pathname !== '/' || parsed.search || !/^[a-f0-9]{32}$/.test(parsed.hash.slice(1)) || value.length > 2048) { res.writeHead(400).end(); return; }
      const svg = await QRCode.toString(value, { type: 'svg', margin: 1, color: { dark: '#13231e', light: '#ffffff' } });
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
      res.end(svg); return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = path.resolve(publicDir, relative);
    if (!file.startsWith(publicDir + path.sep)) { res.writeHead(403).end(); return; }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss: ws:; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end(); }
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 32 * 1024 });
server.on('upgrade', (req, socket, head) => {
  if (new URL(req.url, 'http://localhost').pathname !== '/signal') { socket.destroy(); return; }
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; } }
    catch { socket.destroy(); return; }
  }
  wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws));
});

function send(ws, message) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}
function leave(ws) {
  const room = rooms.get(ws.room);
  if (!room) return;
  room.peers.delete(ws);
  for (const peer of room.peers) send(peer, { type: 'peer-left' });
  if (!room.peers.size) rooms.delete(ws.room);
  ws.room = undefined;
}
wss.on('connection', ws => {
  ws.on('message', raw => {
    let message;
    try { message = JSON.parse(raw.toString()); } catch { return; }
    if (!ws.room) {
      if (message.type !== 'join' || typeof message.room !== 'string' || !/^[a-f0-9]{32}$/.test(message.room)) { ws.close(1008, 'Invalid room'); return; }
      let room = rooms.get(message.room);
      if (!room) { room = { peers: new Set(), touched: Date.now() }; rooms.set(message.room, room); }
      if (room.peers.size >= 2) { send(ws, { type: 'full' }); ws.close(1008, 'Room full'); return; }
      ws.room = message.room;
      room.peers.add(ws);
      room.touched = Date.now();
      send(ws, { type: 'joined', count: room.peers.size });
      if (room.peers.size === 2) {
        for (const peer of room.peers) if (peer !== ws) send(peer, { type: 'peer-joined' });
      }
      return;
    }
    const room = rooms.get(ws.room);
    if (!room) return;
    room.touched = Date.now();
    if (message.type === 'heartbeat') return;
    if (!['offer', 'answer', 'candidate'].includes(message.type) || !message.payload || typeof message.payload !== 'object') return;
    for (const peer of room.peers) if (peer !== ws) send(peer, { type: message.type, payload: message.payload });
  });
  ws.on('close', () => leave(ws));
  ws.on('error', () => leave(ws));
});
const cleanup = setInterval(() => {
  for (const [id, room] of rooms) {
    if (Date.now() - room.touched > maxAge) {
      for (const peer of room.peers) peer.close(1001, 'Room expired');
      rooms.delete(id);
    }
  }
}, 60_000);
cleanup.unref();

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) server.listen(port, () => console.log(`BlinkSend listening on http://localhost:${port}`));
export { server, rooms };
