import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { WebSocket } from 'ws';
import { server, rooms, limits, pairCodes, counters } from '../server.js';

const ROOM_COUNT=10, SIGNALS_PER_ROOM=50, sockets=[];
function connect(url){return new Promise((resolve,reject)=>{const ws=new WebSocket(url);sockets.push(ws);ws.once('open',()=>resolve(ws));ws.once('error',reject);});}
function next(ws,timeout=3000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('message timeout'));},timeout);const onMessage=data=>{cleanup();resolve(JSON.parse(data));};const onError=err=>{cleanup();reject(err);};function cleanup(){clearTimeout(timer);ws.off('message',onMessage);ws.off('error',onError);}ws.once('message',onMessage);ws.once('error',onError);});}
function close(ws){return new Promise(resolve=>{if(ws.readyState===WebSocket.CLOSED)return resolve();ws.once('close',resolve);ws.close();setTimeout(()=>{if(ws.readyState!==WebSocket.CLOSED)ws.terminate();resolve();},1000).unref();});}

rooms.clear();limits.clear();pairCodes.clear();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port,url=`ws://127.0.0.1:${port}/signal`,started=performance.now();
try{
  for(let r=0;r<ROOM_COUNT;r++){
    const room=r.toString(16).padStart(32,'0'),a=await connect(url),b=await connect(url);
    const aJoined=next(a);a.send(JSON.stringify({type:'join',room}));const first=await aJoined;assert.equal(first.type,'joined');assert.match(first.pairCode,/^[A-Z2-9]{8}$/);
    const bJoined=next(b),peerJoined=next(a);b.send(JSON.stringify({type:'join',room}));assert.equal((await bJoined).type,'joined');assert.equal((await peerJoined).type,'peer-joined');
    for(let i=0;i<SIGNALS_PER_ROOM;i++){const forwarded=next(b);a.send(JSON.stringify({type:'offer',payload:{type:'offer',sdp:`v=0\r\no=blink ${i}\r\n`}}));const message=await forwarded;assert.equal(message.type,'offer');}
    const resolved=await fetch(`http://127.0.0.1:${port}/pair/resolve`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:first.pairCode})});assert.equal(resolved.status,200);assert.equal((await resolved.json()).room,room);
  }
  assert.equal(rooms.size,ROOM_COUNT);assert.ok(counters.signalsForwarded>=ROOM_COUNT*SIGNALS_PER_ROOM);
  const health=await fetch(`http://127.0.0.1:${port}/health`);assert.deepEqual(await health.json(),{status:'ok'});
  const elapsed=performance.now()-started;
  console.log(JSON.stringify({rooms:ROOM_COUNT,peers:ROOM_COUNT*2,signals:ROOM_COUNT*SIGNALS_PER_ROOM,elapsedMs:+elapsed.toFixed(1),signalsPerSecond:+((ROOM_COUNT*SIGNALS_PER_ROOM)/(elapsed/1000)).toFixed(1)},null,2));
}finally{await Promise.allSettled(sockets.map(close));await new Promise(resolve=>server.close(resolve));rooms.clear();limits.clear();pairCodes.clear();}