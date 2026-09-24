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
  const weak=p.chooseTuning({throughputBps:100e6,rttMs:20,deviceMemory:2,cores:2,maxMessageSize:262144});
  assert.equal(weak.chunkSize,65536);assert.ok(weak.highWater>=8*1024*1024);
  const fast=p.chooseTuning({throughputBps:100*1024*1024,rttMs:20,deviceMemory:8,cores:8,maxMessageSize:262144});
  assert.equal(fast.chunkSize,262140);assert.ok(fast.highWater>=24*1024*1024);assert.ok(fast.receiveWindow>=32*1024*1024);
  const capped=p.chooseTuning({throughputBps:100*1024*1024,rttMs:20,deviceMemory:8,cores:8,maxMessageSize:65536});
  assert.ok(capped.chunkSize+4<=65536);
});
test('ETA formatting and missing ranges are deterministic',async()=>{
  const p=await loadProtocol();assert.equal(p.formatEta(65),'1m 5s');
  const map=new Uint8Array(1);p.markChunk(map,0);p.markChunk(map,3);
  assert.deepEqual(JSON.parse(JSON.stringify(p.missingRanges(map,5))),[[1,2],[4,4]]);
});
test('connection quality degrades for high RTT',async()=>{
  const p=await loadProtocol();assert.equal(p.connectionQuality({rttMs:350,throughputBps:10*1024*1024,relayed:false}),'poor');
});
test('transfer ETA uses measured recent throughput and resets after a stall',async()=>{
  const p=await loadProtocol();
  let state=p.updateTransferEstimate(null,{bytes:0,total:10*1024*1024,label:'sending',now:0});
  state=p.updateTransferEstimate(state,{bytes:1024*1024,total:10*1024*1024,label:'sending',now:1000});
  assert.equal(Math.round(state.speed),1024*1024);
  assert.equal(Math.round(state.etaSeconds),9);
  state=p.updateTransferEstimate(state,{bytes:2*1024*1024,total:10*1024*1024,label:'sending',now:2000});
  assert.equal(Math.round(state.etaSeconds),8);
  state=p.updateTransferEstimate(state,{bytes:3*1024*1024,total:10*1024*1024,label:'sending',now:7000});
  assert.equal(state.speed,0);
  assert.equal(state.etaSeconds,Infinity);
  state=p.updateTransferEstimate(state,{bytes:4*1024*1024,total:10*1024*1024,label:'sending',now:8000});
  assert.equal(Math.round(state.speed),1024*1024);
  assert.equal(Math.round(state.etaSeconds),6);
});

test('high-throughput tuning scales read/write batches without exceeding SCTP message size',async()=>{
  const p=await loadProtocol();
  const t=p.chooseTuning({throughputBps:40*1024*1024,rttMs:30,deviceMemory:8,cores:8,maxMessageSize:262144});
  assert.equal(t.chunkSize,262140);
  assert.ok(t.readAhead>=16*1024*1024);
  assert.ok(t.writeBatch>=4*1024*1024);
  assert.ok(t.receiveWindow>=32*1024*1024);
  assert.ok(t.checkpointBytes>=128*1024*1024);
  assert.equal(t.chunkSize+4,262144);
});

test('receiver-aware flow window stays conservative on weak devices and expands on fast links',async()=>{
  const p=await loadProtocol();
  const weak=p.chooseTuning({throughputBps:8*1024*1024,rttMs:20,deviceMemory:2,cores:2,maxMessageSize:262144});
  const fast=p.chooseTuning({throughputBps:40*1024*1024,rttMs:20,deviceMemory:8,cores:8,maxMessageSize:262148});
  assert.ok(weak.receiveWindow<=16*1024*1024);
  assert.ok(fast.receiveWindow>=32*1024*1024);
  assert.ok(fast.flowAckBytes<fast.receiveWindow);
});

test('unknown device memory uses a conservative receive window without slowing sender buffering',async()=>{
  const p=await loadProtocol();
  const t=p.chooseTuning({throughputBps:40*1024*1024,rttMs:25,deviceMemory:0,cores:6,maxMessageSize:262144});
  assert.equal(t.receiveWindow,16*1024*1024);
  assert.ok(t.highWater>=16*1024*1024);
});


test('same-LAN tuning opens the pipeline without bypassing SCTP limits',async()=>{
  const p=await loadProtocol();
  const t=p.chooseTuning({throughputBps:12*1024*1024,rttMs:5,deviceMemory:0,cores:6,maxMessageSize:262144,lan:true});
  assert.equal(t.chunkSize,192*1024);
  assert.ok(t.highWater>=48*1024*1024);
  assert.ok(t.readAhead>=32*1024*1024);
  assert.ok(t.receiveWindow>=24*1024*1024);
  assert.ok(t.chunkSize+4<=262144);
});

test('receiver window grows from actual committed batch speed and shrinks when storage is slow',async()=>{
  const p=await loadProtocol();
  let state=p.adaptReceiveWindow({current:16*1024*1024,batchBytes:8*1024*1024,batchMs:100});
  assert.ok(state.throughputBps>70*1024*1024);
  assert.equal(state.window,24*1024*1024);
  state=p.adaptReceiveWindow({current:state.window,previousBps:state.throughputBps,batchBytes:8*1024*1024,batchMs:120});
  assert.ok(state.window>=32*1024*1024);
  let slow=p.adaptReceiveWindow({current:32*1024*1024,batchBytes:4*1024*1024,batchMs:2000});
  slow=p.adaptReceiveWindow({current:slow.window,previousBps:slow.throughputBps,batchBytes:4*1024*1024,batchMs:2000});
  assert.ok(slow.window<32*1024*1024);
  assert.ok(slow.window>=8*1024*1024);
});
