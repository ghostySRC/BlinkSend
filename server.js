import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import QRCode from 'qrcode';
import { createHmac, randomBytes } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const maxAge = 30 * 60 * 1000;
const rooms = new Map();
const iceTokens = new Map();
const limits = new Map();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function clientIp(req) { return req.socket?.remoteAddress || 'unknown'; }
function allowed(key, max, windowMs) {
  const now = Date.now(); let item = limits.get(key);
  if (!item || now - item.start >= windowMs) { item = { start: now, count: 0 }; limits.set(key, item); }
  item.count++; return item.count <= max;
}
function issueIceToken(ip) {
  const token = randomBytes(24).toString('base64url');
  iceTokens.set(token, { ip, expires: Date.now() + 120_000, uses: 2 });
  return token;
}
function consumeIceToken(token, ip) {
  const item = iceTokens.get(token);
  if (!item || item.ip !== ip || item.expires < Date.now() || item.uses <= 0) { if (item) iceTokens.delete(token); return false; }
  item.uses--; if (!item.uses) iceTokens.delete(token); return true;
}
function validSignal(type, payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (type === 'offer' || type === 'answer') return payload.type === type && typeof payload.sdp === 'string' && payload.sdp.length > 0 && payload.sdp.length <= 24 * 1024;
  if (type === 'candidate') return typeof payload.candidate === 'string' && payload.candidate.length <= 4096 &&
    (payload.sdpMid == null || (typeof payload.sdpMid === 'string' && payload.sdpMid.length <= 128)) &&
    (payload.sdpMLineIndex == null || (Number.isInteger(payload.sdpMLineIndex) && payload.sdpMLineIndex >= 0 && payload.sdpMLineIndex <= 128));
  return false;
}
function securityHeaders(extra = {}) {
  return { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', ...extra };
}

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
      const ip = clientIp(req);
      if (!allowed(`ice:${ip}`, 30, 60_000)) { res.writeHead(429, securityHeaders({ 'Retry-After': '60', 'Cache-Control': 'no-store' })).end(); return; }
      const token = new URL(req.url, 'http://localhost').searchParams.get('token') || '';
      if (!consumeIceToken(token, ip)) { res.writeHead(403, securityHeaders({ 'Cache-Control': 'no-store' })).end(); return; }
      res.writeHead(200, securityHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
      res.end(JSON.stringify({ iceServers: iceServers() })); return;
    }
    if (pathname === '/qr') {
      const ip = clientIp(req); if (!allowed(`qr:${ip}`, 60, 60_000)) { res.writeHead(429, securityHeaders({ 'Retry-After': '60' })).end(); return; }
      const value = new URL(req.url, 'http://localhost').searchParams.get('url') || '';
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.host !== req.headers.host || parsed.pathname !== '/' || parsed.search || !/^[a-f0-9]{32}$/.test(parsed.hash.slice(1)) || value.length > 2048) { res.writeHead(400).end(); return; }
      const svg = await QRCode.toString(value, { type: 'svg', margin: 1, color: { dark: '#13231e', light: '#ffffff' } });
      res.writeHead(200, securityHeaders({ 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }));
      res.end(svg); return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = path.resolve(publicDir, relative);
    if (!file.startsWith(publicDir + path.sep)) { res.writeHead(403).end(); return; }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, securityHeaders({ 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss: ws:; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'" }));
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end(); }
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 32 * 1024 });
server.on('upgrade', (req, socket, head) => {
  const ip = clientIp(req); if (!allowed(`upgrade:${ip}`, 60, 60_000)) { socket.write('HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n'); socket.destroy(); return; }
  if (new URL(req.url, 'http://localhost').pathname !== '/signal') { socket.destroy(); return; }
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; } }
    catch { socket.destroy(); return; }
  }
  wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
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
wss.on('connection', (ws, req) => {
  ws.ip = clientIp(req); ws.windowStarted = Date.now(); ws.messageCount = 0; ws.badMessages = 0;
  ws.on('message', raw => {
    const now = Date.now(); if (now - ws.windowStarted >= 60_000) { ws.windowStarted = now; ws.messageCount = 0; }
    if (++ws.messageCount > 600) { ws.close(1008, 'Rate limit'); return; }
    let message;
    try { message = JSON.parse(raw.toString()); } catch { return; }
    if (!ws.room) {
      if (message.type !== 'join' || typeof message.room !== 'string' || !/^[a-f0-9]{32}$/.test(message.room) || !allowed(`join:${ws.ip}`, 30, 5 * 60_000)) { ws.close(1008, 'Invalid or rate-limited room'); return; }
      let room = rooms.get(message.room);
      if (!room) { room = { peers: new Set(), touched: Date.now() }; rooms.set(message.room, room); }
      if (room.peers.size >= 2) { send(ws, { type: 'full' }); ws.close(1008, 'Room full'); return; }
      ws.room = message.room;
      room.peers.add(ws);
      room.touched = Date.now();
      send(ws, { type: 'joined', count: room.peers.size, iceToken: issueIceToken(ws.ip) });
      if (room.peers.size === 2) {
        for (const peer of room.peers) if (peer !== ws) send(peer, { type: 'peer-joined' });
      }
      return;
    }
    const room = rooms.get(ws.room);
    if (!room) return;
    room.touched = Date.now();
    if (message.type === 'heartbeat') return;
    if (!['offer', 'answer', 'candidate'].includes(message.type) || !validSignal(message.type, message.payload)) {
      if (++ws.badMessages >= 8) ws.close(1008, 'Malformed signaling');
      return;
    }
    for (const peer of room.peers) if (peer !== ws) send(peer, { type: message.type, payload: message.payload });
  });
  ws.on('close', () => leave(ws));
  ws.on('error', () => leave(ws));
});
const cleanup = setInterval(() => {
  for (const [token, item] of iceTokens) if (item.expires < Date.now()) iceTokens.delete(token);
  for (const [key, item] of limits) if (Date.now() - item.start > 10 * 60_000) limits.delete(key);
  for (const [id, room] of rooms) {
    if (Date.now() - room.touched > maxAge) {
      for (const peer of room.peers) peer.close(1001, 'Room expired');
      rooms.delete(id);
    }
  }
}, 60_000);
cleanup.unref();

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) server.listen(port, () => console.log(`BlinkSend listening on http://localhost:${port}`));
export { server, rooms, iceTokens, limits };
