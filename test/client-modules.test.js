import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function run(path,ctx={}){ctx.window=ctx.window||{};ctx.TextEncoder=TextEncoder;ctx.Uint8Array=Uint8Array;ctx.DataView=DataView;ctx.ArrayBuffer=ArrayBuffer;vm.createContext(ctx);vm.runInContext(await readFile(new URL('../public/'+path,import.meta.url),'utf8'),ctx);return ctx;}

test('verification code is symmetric and fingerprint parser is strict',async()=>{
  const ctx=await run('verification.js',{crypto:{subtle:{digest:async()=>Uint8Array.from([1,2,3,4]).buffer}}});const v=ctx.window.BlinkVerification;
  const a={sdp:'v=0\r\na=fingerprint:sha-256 AA:BB:CC\r\n'},b={sdp:'v=0\r\na=fingerprint:sha-256 11:22:33\r\n'};
  assert.equal(v.fingerprint(a),'aabbcc');assert.equal(await v.deriveCode(a,b),await v.deriveCode(b,a));assert.equal(v.fingerprint({sdp:'a=fingerprint:sha-1 AA:BB'}),'');
});
test('connection summary never exposes candidate addresses',async()=>{
  const ctx=await run('connection.js');const c=ctx.window.BlinkConnection;const stats=new Map();
  stats.set('transport',{type:'transport',selectedCandidatePairId:'pair'});stats.set('pair',{type:'candidate-pair',localCandidateId:'l',remoteCandidateId:'r',currentRoundTripTime:.042});
  stats.set('l',{candidateType:'host',address:'192.168.1.10'});stats.set('r',{candidateType:'relay',address:'203.0.113.5'});
  const x=c.summarize(stats);assert.equal(x.relayed,true);assert.equal(x.rttMs,42);assert.equal(x.localType,'host');assert.equal(x.remoteType,'relay');assert.equal('address' in x,false);
});
test('transfer chunk packing is reversible and duplicate bitmap checks are pure',async()=>{
  const ctx={window:{BlinkProtocol:{markChunk:(m,i)=>{m[i>>3]|=1<<(i&7);return m;}},BlinkSHA256:class{},BlinkSecurity:{chunkCount:()=>1,LIMITS:{maxChunks:10}}}};await run('transfer-core.js',ctx);const t=ctx.window.BlinkTransfer;
  const packed=t.packChunk(77,Uint8Array.from([4,5,6]).buffer),u=t.unpackChunk(packed);assert.equal(u.seq,77);assert.deepEqual([...u.payload],[4,5,6]);
  const map=t.makePrefixBitmap(10,3);assert.equal(t.bitmapHas(map,0),true);assert.equal(t.bitmapHas(map,2),true);assert.equal(t.bitmapHas(map,3),false);
});
test('final sender hash works for normal and missing-range resume paths',async()=>{
  const ctx={window:{BlinkProtocol:{markChunk:()=>{}},BlinkSecurity:{chunkCount:()=>1,LIMITS:{maxChunks:10}},BlinkSHA256:class{}}};await run('transfer-core.js',ctx);const t=ctx.window.BlinkTransfer;
  const hash='a'.repeat(64);assert.equal(t.finalHash({fullHash:hash,hasher:null}),hash);assert.equal(t.finalHash({fullHash:'',hasher:{hex:()=>hash}}),hash);assert.equal(t.finalHash({}), '');
});
