import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function load(){const source=await readFile(new URL('../public/security.js',import.meta.url),'utf8');const ctx={window:{},TextEncoder};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.BlinkSecurity;}

test('rejects absurd batch metadata before allocation',async()=>{const s=await load();assert.equal(s.validBatchRequest({id:'x',name:'folder',count:s.LIMITS.batchFiles+1,totalSize:1}),false);assert.equal(s.validBatchRequest({id:'x',name:'folder',count:1,totalSize:s.LIMITS.batchBytes+1}),false);assert.equal(s.validBatchRequest({id:'x',name:'folder',count:100,totalSize:1000}),true);});
test('bounds chunk bitmap work independently of safe integer size',async()=>{const s=await load();const size=(s.LIMITS.maxChunks+1)*s.LIMITS.maxChunkBytes;assert.ok(Number.isSafeInteger(size));assert.equal(s.validFileRequest({id:'id',name:'x.bin',size,chunkSize:s.LIMITS.maxChunkBytes}),false);assert.equal(s.chunkCount(1024*1024,64*1024),16);});
test('rejects traversal, deep paths, oversized names and ids',async()=>{const s=await load();assert.equal(s.safeRelativePath('../secret'),null);assert.equal(s.safeRelativePath(Array(s.LIMITS.pathSegments+2).fill('a').join('/')),null);assert.equal(s.validFileRequest({id:'x'.repeat(s.LIMITS.idChars+1),name:'ok',size:1,chunkSize:65536}),false);assert.equal(s.validFileRequest({id:'x',name:'n'.repeat(s.LIMITS.fileNameChars+1),size:1,chunkSize:65536}),false);});
test('resume ranges must be ordered, non-overlapping and bounded',async()=>{const s=await load();assert.equal(s.validRanges([[0,2],[3,5]],10),true);assert.equal(s.validRanges([[0,2],[2,5]],10),false);assert.equal(s.validRanges([[0,11]],10),false);assert.equal(s.validRanges(Array.from({length:s.LIMITS.resumeRanges+1},(_,i)=>[i,i]),1000),false);});
test('clipboard frames cannot force oversized allocations',async()=>{const s=await load();assert.equal(s.validTextStart({id:'x',parts:s.LIMITS.textParts+1,bytes:1}),false);const state={id:'x',parts:new Array(2)};assert.equal(s.validTextPart({id:'x',index:0,text:'ok'},state),true);assert.equal(s.validTextPart({id:'x',index:0,text:'a'.repeat(s.LIMITS.textPartBytes+1)},state),false);});
test('control JSON has a hard byte ceiling',async()=>{const s=await load();assert.equal(s.controlJsonWithinLimit('{}'),true);assert.equal(s.controlJsonWithinLimit('x'.repeat(s.LIMITS.controlJsonBytes+1)),false);});
test('fuzzed malformed requests never validate',async()=>{const s=await load();let seed=0x12345678;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed;};for(let i=0;i<5000;i++){const msg={id:i%7?'id':'x'.repeat(100),name:i%11?'file.bin':null,size:(rnd()%2)?-(rnd()%1000):Number.MAX_SAFE_INTEGER,chunkSize:[0,1,16384,65536,131072][rnd()%5],relativePath:i%13?'ok/file':'../escape'};assert.equal(s.validFileRequest(msg),false);}});
test('persisted resume metadata is validated before restore',async()=>{
  const s=await load(),handle={};
  const good={role:'receive',transferId:'id',handle,name:'a.bin',size:65536,relativePath:'',chunkSize:65536,received:0,nextChunk:0,receivedMap:new Uint8Array(1)};
  assert.equal(s.validPersistedSession(good),true);
  assert.equal(s.validPersistedSession({...good,size:Number.MAX_SAFE_INTEGER}),false);
  assert.equal(s.validPersistedSession({...good,nextChunk:99}),false);
  assert.equal(s.validPersistedSession({...good,receivedMap:new Uint8Array(999)}),false);
  const send={role:'send',transferId:'id',handle,name:'a.bin',size:1,relativePath:'',chunkSize:65536,lastModified:123,batchEntries:[],batchDone:0};
  assert.equal(s.validPersistedSession(send),true);
  assert.equal(s.validPersistedSession({...send,batchEntries:Array(s.LIMITS.batchFiles+1).fill({handle,name:'x',size:1,relativePath:''})}),false);
  assert.equal(s.validPersistedSession({...send,batchEntries:[{name:'x',size:1,relativePath:''}]}),false);
});

test('accepted batch manifest cannot be exceeded or completed early',async()=>{
  const s=await load(),batch={accepted:true,count:2,totalSize:100,completedCount:0,completedBytes:0};
  assert.equal(s.batchAllowsFile(batch,{size:60}),true);
  batch.completedCount=1;batch.completedBytes=60;
  assert.equal(s.batchAllowsFile(batch,{size:40}),true);
  assert.equal(s.batchAllowsFile(batch,{size:41}),false);
  assert.equal(s.batchCompleteIsConsistent(batch),false);
  batch.completedCount=2;batch.completedBytes=100;
  assert.equal(s.batchAllowsFile(batch,{size:0}),false);
  assert.equal(s.batchCompleteIsConsistent(batch),true);
});

test('negotiated high-throughput chunks stay bounded',async()=>{const s=await load();assert.equal(s.LIMITS.maxChunkBytes,256*1024);assert.equal(s.chunkCount(256*1024,256*1024),1);});

test('receiver flow updates are bounded and cannot claim impossible progress',async()=>{
  const s=await load(),size=1024*1024*1024;
  assert.equal(s.validFlowWindow(24*1024*1024),true);
  assert.equal(s.validFlowWindow(1024),false);
  assert.equal(s.validFlowWindow(s.LIMITS.flowWindowMax+1),false);
  assert.equal(s.validFlowUpdate({id:'x',received:512*1024*1024,windowBytes:24*1024*1024},size),true);
  assert.equal(s.validFlowUpdate({id:'x',received:size+1,windowBytes:24*1024*1024},size),false);
});
