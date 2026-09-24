import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function loadProtocol(){
  const source=await readFile(new URL('../public/protocol.js',import.meta.url),'utf8');
  const context={window:{}};vm.createContext(context);vm.runInContext(source,context);return context.window.BlinkProtocol;
}
test('adaptive tuning stays browser-safe and scales buffer targets',async()=>{
  const p=await loadProtocol();
  const weak=p.chooseTuning({throughputBps:100e6,rttMs:20,deviceMemory:2,cores:2});
  assert.equal(weak.chunkSize,32768);assert.ok(weak.highWater<=2*1024*1024);
  const fast=p.chooseTuning({throughputBps:100*1024*1024,rttMs:20,deviceMemory:8,cores:8});
  assert.equal(fast.chunkSize,65536);assert.ok(fast.highWater>=16*1024*1024);
});
test('ETA formatting and missing ranges are deterministic',async()=>{
  const p=await loadProtocol();assert.equal(p.formatEta(65),'1m 5s');
  const map=new Uint8Array(1);p.markChunk(map,0);p.markChunk(map,3);
  assert.deepEqual(JSON.parse(JSON.stringify(p.missingRanges(map,5))),[[1,2],[4,4]]);
});
test('connection quality degrades for high RTT',async()=>{
  const p=await loadProtocol();assert.equal(p.connectionQuality({rttMs:350,throughputBps:10*1024*1024,relayed:false}),'poor');
});