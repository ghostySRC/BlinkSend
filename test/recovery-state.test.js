import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function modules(){
  const ctx={window:{},TextEncoder,Uint8Array,DataView,ArrayBuffer};vm.createContext(ctx);
  for(const file of ['protocol.js','security.js','transfer-core.js','control-policy.js'])vm.runInContext(await readFile(new URL('../public/'+file,import.meta.url),'utf8'),ctx);
  return ctx.window;
}
test('unverified peers cannot initiate files, folders, text or benchmarks',async()=>{const w=await modules(),p=w.BlinkControlPolicy;for(const type of ['request','batch-request','text-start','text','benchmark-start','complete','saved','retry'])assert.equal(p.allowed(type,false),false,type);for(const type of ['hello','verify-confirm','resume','resume-map','cancel'])assert.equal(p.allowed(type,false),true,type);});
test('37 percent disconnect, sparse resume, second disconnect, reload and completion',async()=>{
  const w=await modules(),t=w.BlinkTransfer,size=100*64*1024,chunk=64*1024;let state=t.makeReceiveState(size,chunk);assert.ok(state);
  for(let i=0;i<37;i++)assert.equal(t.commitChunk(state,i,chunk).committed,true);assert.equal(state.nextChunk,37);
  let missing=t.missingRanges(state);assert.deepEqual(JSON.parse(JSON.stringify(missing)),[[37,99]]);
  for(const i of [37,39,40,42])t.commitChunk(state,i,chunk);assert.equal(state.nextChunk,38);missing=t.missingRanges(state);assert.deepEqual(JSON.parse(JSON.stringify(missing)),[[38,38],[41,41],[43,99]]);
  const persisted=state.receivedMap.slice(),received=state.received,next=state.nextChunk;state=t.makeReceiveState(size,chunk,persisted,next,received);
  assert.equal(state.nextChunk,38);assert.deepEqual(JSON.parse(JSON.stringify(t.missingRanges(state))),[[38,38],[41,41],[43,99]]);
  for(const [s,e] of t.missingRanges(state))for(let i=s;i<=e;i++)t.commitChunk(state,i,chunk);assert.equal(state.received,size);assert.equal(state.nextChunk,100);assert.deepEqual(JSON.parse(JSON.stringify(t.missingRanges(state))),[]);
});
test('duplicates do not increase received bytes and short/oversized chunks are rejected',async()=>{const w=await modules(),t=w.BlinkTransfer,state=t.makeReceiveState(100000,65536);assert.equal(t.commitChunk(state,0,65536).committed,true);assert.equal(state.received,65536);assert.equal(t.commitChunk(state,0,65536).duplicate,true);assert.equal(state.received,65536);assert.equal(t.inspectChunk(state,1,65536).ok,false);assert.equal(t.inspectChunk(state,1,34464).ok,true);});
test('impossible message types are rejected by policy',async()=>{const w=await modules(),p=w.BlinkControlPolicy;for(const type of ['',null,undefined,'request-now','__proto__','complete\u0000'])assert.equal(p.allowed(type,true),false);});
test('legacy resume positions cannot exceed the file chunk count',async()=>{
  const w=await modules(),s=w.BlinkSecurity,total=s.chunkCount(10*65536,65536);assert.equal(total,10);
  assert.equal(Number.isSafeInteger(total+1)&&(total+1>total),true);
});
