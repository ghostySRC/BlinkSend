import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { server, clientIp, shutdown, rooms, limits, pairCodes } from '../server.js';

test('proxy identity is trusted only when explicitly enabled and only for valid IPs',()=>{
  const req={socket:{remoteAddress:'::ffff:127.0.0.1'},headers:{'x-forwarded-for':'203.0.113.25, 10.0.0.2'}};
  delete process.env.TRUST_PROXY;assert.equal(clientIp(req),'127.0.0.1');
  process.env.TRUST_PROXY='1';assert.equal(clientIp(req),'203.0.113.25');
  assert.equal(clientIp({socket:{remoteAddress:'::ffff:127.0.0.1'},headers:{'x-forwarded-for':'not-an-ip'}}),'127.0.0.1');
  delete process.env.TRUST_PROXY;
});

test('graceful shutdown notifies WebSocket clients and closes with restart code',async()=>{
  rooms.clear();limits.clear();pairCodes.clear();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;
  const ws=await new Promise((resolve,reject)=>{const socket=new WebSocket(`ws://127.0.0.1:${port}/signal`);socket.once('open',()=>resolve(socket));socket.once('error',reject);});
  const notice=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('restart notice timeout')),2000);ws.on('message',raw=>{const msg=JSON.parse(raw);if(msg.type==='server-restart'){clearTimeout(timer);resolve(msg);}});});
  const closed=new Promise(resolve=>ws.once('close',(code,reason)=>resolve({code,reason:reason.toString()})));
  const stopping=shutdown('test');assert.deepEqual(await notice,{type:'server-restart'});const info=await closed;assert.equal(info.code,1012);assert.match(info.reason,/restarting/i);await stopping;assert.equal(server.listening,false);
});