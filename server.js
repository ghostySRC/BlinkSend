import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { isIP } from 'node:net';
import { WebSocketServer, WebSocket } from 'ws';
import QRCode from 'qrcode';
import { createHmac, randomBytes, timingSafeEqual, createHash } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const maxAge = 30 * 60 * 1000;
const rooms = new Map();
const iceTokens = new Map();
const limits = new Map();
const nearby = new Map();
const pairCodes = new Map();
const startedAt = Date.now();
const trustProxyEnabled = () => /^(1|true|yes)$/i.test(process.env.TRUST_PROXY || '');
const counters = { httpRequests:0, websocketUpgrades:0, websocketConnections:0, roomJoins:0, rejectedJoins:0, signalsForwarded:0, malformedSignals:0, rateLimited:0, pairResolves:0, pairResolveMisses:0, iceCredentialsIssued:0 };
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function normalizeIp(value){return String(value||'unknown').trim().replace(/^::ffff:/,'');}
function clientIp(req) {
  const direct=normalizeIp(req.socket?.remoteAddress);
  if(!trustProxyEnabled())return direct;
  const forwarded=normalizeIp(String(req.headers['x-forwarded-for']||'').split(',')[0].trim());
  return isIP(forwarded)?forwarded:direct;
}
function logEvent(event, fields={}) {
  if((process.env.LOG_LEVEL||'info').toLowerCase()==='silent')return;
  const record={time:new Date().toISOString(),event,...fields};
  if((process.env.LOG_FORMAT||'text').toLowerCase()==='json')console.log(JSON.stringify(record));
  else console.log(`[BlinkSend] ${event}`, Object.keys(fields).length?fields:'');
}
function secureEqual(a,b){const x=createHash('sha256').update(String(a)).digest(),y=createHash('sha256').update(String(b)).digest();return timingSafeEqual(x,y);}
function prunePairCodes(){const now=Date.now();for(const [code,item] of pairCodes){if(item.expires<=now||!rooms.has(item.room))pairCodes.delete(code);}}
function makePairCode(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let code='';
  do{code='';const bytes=randomBytes(8);for(let i=0;i<8;i++)code+=alphabet[bytes[i]%alphabet.length];}while(pairCodes.has(code));
  return code;
}
function issuePairCode(roomId){
  prunePairCodes();const room=rooms.get(roomId);if(!room)return {code:'',expires:0};
  const current=room.pairCode&&pairCodes.get(room.pairCode);if(current&&current.expires>Date.now())return {code:room.pairCode,expires:current.expires};
  const code=makePairCode(),expires=Date.now()+10*60_000;pairCodes.set(code,{room:roomId,expires});room.pairCode=code;return {code,expires};
}
function removePairCode(room){if(room?.pairCode)pairCodes.delete(room.pairCode);}
function metricsText(){
  let peers=0,nearbyRecords=0;for(const room of rooms.values())peers+=room.peers.size;for(const bucket of nearby.values())nearbyRecords+=bucket.size;
  const lines=[
    '# HELP blinksend_uptime_seconds Process uptime in seconds.','# TYPE blinksend_uptime_seconds gauge',`blinksend_uptime_seconds ${Math.floor((Date.now()-startedAt)/1000)}`,
    '# HELP blinksend_rooms Active signaling rooms.','# TYPE blinksend_rooms gauge',`blinksend_rooms ${rooms.size}`,
    '# HELP blinksend_peers Active signaling peers.','# TYPE blinksend_peers gauge',`blinksend_peers ${peers}`,
    '# HELP blinksend_nearby_records Active Nearby discovery records.','# TYPE blinksend_nearby_records gauge',`blinksend_nearby_records ${nearbyRecords}`,
    '# HELP blinksend_pair_codes Active manual pairing codes.','# TYPE blinksend_pair_codes gauge',`blinksend_pair_codes ${pairCodes.size}`
  ];
  const names={httpRequests:'http_requests_total',websocketUpgrades:'websocket_upgrades_total',websocketConnections:'websocket_connections_total',roomJoins:'room_joins_total',rejectedJoins:'rejected_joins_total',signalsForwarded:'signals_forwarded_total',malformedSignals:'malformed_signals_total',rateLimited:'rate_limited_total',pairResolves:'pair_resolves_total',pairResolveMisses:'pair_resolve_misses_total',iceCredentialsIssued:'ice_credentials_issued_total'};
  for(const [name,value] of Object.entries(counters)){const metric=names[name]||name;lines.push(`# TYPE blinksend_${metric} counter`,`blinksend_${metric} ${value}`);}
  return lines.join('\n')+'\n';
}
async function readJson(req, limit = 4096) {
  const chunks=[];let size=0;
  for await (const chunk of req) { size+=chunk.length;if(size>limit)throw new Error('body too large');chunks.push(chunk); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
function nearbyBucket(ip){let bucket=nearby.get(ip);if(!bucket){bucket=new Map();nearby.set(ip,bucket);}return bucket;}
function pruneNearby(ip){const now=Date.now(),bucket=nearby.get(ip);if(!bucket)return;for(const [room,item] of bucket)if(item.expires<=now)bucket.delete(room);if(!bucket.size)nearby.delete(ip);}
function makeNearbyCode(bucket){let code;do{code=randomBytes(4).toString('base64url').replace(/[-_]/g,'').slice(0,6).toUpperCase();}while([...bucket.values()].some(x=>x.code===code));return code;}
function allowed(key, max, windowMs) {
  const now = Date.now(); let item = limits.get(key);
  if (!item || now - item.start >= windowMs) { item = { start: now, count: 0 }; limits.set(key, item); }
  item.count++; const ok=item.count<=max;if(!ok)counters.rateLimited++;return ok;
}
function issueIceToken(ip) {
  const token = randomBytes(24).toString('base64url');
  iceTokens.set(token, { ip, expires: Date.now() + 120_000, uses: 2 });
  return token;
}
function consumeIceToken(token) {
  const item = iceTokens.get(token);
  // The token is already a short-lived, high-entropy bearer credential. Do not
  // bind it to the request IP: Railway/proxy connection reuse, mobile network
  // changes, and privacy relays can legitimately change the apparent IP between
  // the WebSocket join and the follow-up /ice request.
  if (!item || item.expires < Date.now() || item.uses <= 0) { if (item) iceTokens.delete(token); return false; }
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
    'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()', ...extra };
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
    counters.httpRequests++;
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/health') {
      res.writeHead(200, securityHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
      res.end(JSON.stringify({ status: 'ok' })); return;
    }
    if (pathname === '/metrics') {
      const ip=clientIp(req);if(!allowed(`metrics:${ip}`,60,60_000)){res.writeHead(429,securityHeaders({'Retry-After':'60','Cache-Control':'no-store'})).end();return;}
      const token=process.env.METRICS_TOKEN||'';if(!token){res.writeHead(404).end();return;}
      const auth=String(req.headers.authorization||'');const supplied=auth.startsWith('Bearer ')?auth.slice(7):'';
      if(!secureEqual(supplied,token)){res.writeHead(403,securityHeaders({'Cache-Control':'no-store'})).end();return;}
      res.writeHead(200,securityHeaders({'Content-Type':'text/plain; version=0.0.4; charset=utf-8','Cache-Control':'no-store'}));res.end(metricsText());return;
    }
    if (pathname === '/pair/resolve' && req.method === 'POST') {
      const ip=clientIp(req);if(!allowed(`pair-resolve:${ip}`,12,60_000)||!allowed('pair-resolve:global',2000,60_000)){res.writeHead(429,securityHeaders({'Retry-After':'60','Cache-Control':'no-store'})).end();return;}
      const body=await readJson(req,1024),code=String(body.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);prunePairCodes();const item=pairCodes.get(code);counters.pairResolves++;
      if(!item||!rooms.has(item.room)){counters.pairResolveMisses++;res.writeHead(404,securityHeaders({'Cache-Control':'no-store'})).end();return;}
      res.writeHead(200,securityHeaders({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}));res.end(JSON.stringify({room:item.room,expires:item.expires}));return;
    }
    if (pathname === '/nearby' && req.method === 'GET') {
      const ip=clientIp(req);if(!allowed(`nearby-list:${ip}`,30,60_000)){res.writeHead(429,securityHeaders({'Retry-After':'60'})).end();return;}
      pruneNearby(ip);const items=[...(nearby.get(ip)?.values()||[])].filter(x=>x.listed).map(({name,code,expires})=>({name,code,expires}));
      res.writeHead(200,securityHeaders({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}));res.end(JSON.stringify({items}));return;
    }
    if (pathname === '/nearby/register' && req.method === 'POST') {
      const ip=clientIp(req);if(!allowed(`nearby-register:${ip}`,20,60_000)){res.writeHead(429,securityHeaders({'Retry-After':'60'})).end();return;}
      const body=await readJson(req,2048),room=String(body.room||'').toLowerCase(),name=String(body.name||'BlinkSend device').replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,64),listed=body.listed===true;
      const live=rooms.get(room);if(!/^[a-f0-9]{32}$/.test(room)||!live||![...live.peers].some(p=>p.ip===ip)){res.writeHead(403,securityHeaders({'Cache-Control':'no-store'})).end();return;}
      pruneNearby(ip);const bucket=nearbyBucket(ip),old=bucket.get(room),code=old?.code||makeNearbyCode(bucket),expires=Date.now()+5*60_000;bucket.set(room,{room,name:name||'BlinkSend device',code,listed,expires});
      res.writeHead(200,securityHeaders({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}));res.end(JSON.stringify({code,expires}));return;
    }
    if (pathname === '/nearby/resolve' && req.method === 'POST') {
      const ip=clientIp(req);if(!allowed(`nearby-resolve:${ip}`,30,60_000)){res.writeHead(429,securityHeaders({'Retry-After':'60'})).end();return;}
      const body=await readJson(req,1024),code=String(body.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);pruneNearby(ip);const item=[...(nearby.get(ip)?.values()||[])].find(x=>x.code===code);
      if(!item){res.writeHead(404,securityHeaders({'Cache-Control':'no-store'})).end();return;}res.writeHead(200,securityHeaders({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}));res.end(JSON.stringify({room:item.room,name:item.name}));return;
    }
    if (pathname === '/nearby/unregister' && req.method === 'POST') {
      const ip=clientIp(req),body=await readJson(req,1024),room=String(body.room||'').toLowerCase();nearby.get(ip)?.delete(room);pruneNearby(ip);res.writeHead(204,securityHeaders({'Cache-Control':'no-store'})).end();return;
    }
    if (pathname === '/ice') {
      const ip = clientIp(req);
      if (!allowed(`ice:${ip}`, 30, 60_000)) { res.writeHead(429, securityHeaders({ 'Retry-After': '60', 'Cache-Control': 'no-store' })).end(); return; }
      const token = new URL(req.url, 'http://localhost').searchParams.get('token') || '';
      if (!consumeIceToken(token)) { res.writeHead(403, securityHeaders({ 'Cache-Control': 'no-store' })).end(); return; }
      res.writeHead(200, securityHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
      counters.iceCredentialsIssued++;res.end(JSON.stringify({ iceServers: iceServers() })); return;
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
    res.writeHead(200, securityHeaders({ 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss: ws:; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'" }));
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end(); }
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 32 * 1024 });
server.on('upgrade', (req, socket, head) => {
  counters.websocketUpgrades++;const ip = clientIp(req); if (!allowed(`upgrade:${ip}`, 60, 60_000)) { socket.write('HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n'); socket.destroy(); return; }
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
  if (!room.peers.size) { removePairCode(room); rooms.delete(ws.room); }
  ws.room = undefined;
}
wss.on('connection', (ws, req) => {
  counters.websocketConnections++;ws.ip = clientIp(req); ws.windowStarted = Date.now(); ws.messageCount = 0; ws.badMessages = 0;
  ws.on('message', raw => {
    const now = Date.now(); if (now - ws.windowStarted >= 60_000) { ws.windowStarted = now; ws.messageCount = 0; }
    if (++ws.messageCount > 600) { ws.close(1008, 'Rate limit'); return; }
    let message;
    try { message = JSON.parse(raw.toString()); } catch { return; }
    if (!ws.room) {
      if (message.type !== 'join' || typeof message.room !== 'string' || !/^[a-f0-9]{32}$/.test(message.room) || !allowed(`join:${ws.ip}`, 30, 5 * 60_000)) { counters.rejectedJoins++;ws.close(1008, 'Invalid or rate-limited room'); return; }
      let room = rooms.get(message.room);
      if (!room) { room = { peers: new Set(), touched: Date.now(), pairCode:'' }; rooms.set(message.room, room); }
      if (room.peers.size >= 2) { send(ws, { type: 'full' }); ws.close(1008, 'Room full'); return; }
      ws.room = message.room;
      room.peers.add(ws);
      room.touched = Date.now();
      counters.roomJoins++;const pair=issuePairCode(message.room);send(ws, { type: 'joined', count: room.peers.size, iceToken: issueIceToken(ws.ip), pairCode: pair.code, pairCodeExpires: pair.expires });
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
      counters.malformedSignals++;if (++ws.badMessages >= 8) ws.close(1008, 'Malformed signaling');
      return;
    }
    for (const peer of room.peers) if (peer !== ws) { counters.signalsForwarded++;send(peer, { type: message.type, payload: message.payload }); }
  });
  ws.on('close', () => leave(ws));
  ws.on('error', () => leave(ws));
});
const cleanup = setInterval(() => {
  for (const [token, item] of iceTokens) if (item.expires < Date.now()) iceTokens.delete(token);
  for (const ip of nearby.keys()) pruneNearby(ip);
  prunePairCodes();
  for (const [key, item] of limits) if (Date.now() - item.start > 10 * 60_000) limits.delete(key);
  for (const [id, room] of rooms) {
    if (Date.now() - room.touched > maxAge) {
      for (const peer of room.peers) peer.close(1001, 'Room expired');
      removePairCode(room);rooms.delete(id);
    }
  }
}, 60_000);
cleanup.unref();

let shuttingDown=false;
async function shutdown(signal='manual'){
  if(shuttingDown)return;shuttingDown=true;logEvent('server.shutdown',{signal,rooms:rooms.size,peers:wss.clients.size});
  for(const ws of wss.clients){send(ws,{type:'server-restart'});ws.close(1012,'Server restarting');}
  if(!server.listening)return;
  await new Promise(resolve=>{let done=false;const finish=()=>{if(!done){done=true;resolve();}};server.close(finish);const timer=setTimeout(()=>{for(const ws of wss.clients)ws.terminate();server.closeAllConnections?.();finish();},3000);timer.unref();});
}
const isMain=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isMain){
  server.listen(port,()=>logEvent('server.start',{port,trustProxy:trustProxyEnabled(),metrics:!!process.env.METRICS_TOKEN}));
  for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>shutdown(signal).then(()=>{process.exitCode=0;}));
}
export { server, rooms, iceTokens, limits, nearby, pairCodes, counters, clientIp, shutdown, trustProxyEnabled };
