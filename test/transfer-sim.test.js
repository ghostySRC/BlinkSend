import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function protocol(){const source=await readFile(new URL('../public/protocol.js',import.meta.url),'utf8');const ctx={window:{},TextEncoder};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.BlinkProtocol;}
async function sha(){const source=await readFile(new URL('../public/sha256.js',import.meta.url),'utf8');const ctx={window:{}};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.BlinkSHA256;}

test('5 GiB-equivalent chunk bitmap finds sparse gaps without allocating file data',async()=>{
  const p=await protocol(),chunk=64*1024,total=Math.ceil((5*1024**3)/chunk),map=new Uint8Array(Math.ceil(total/8));
  const missing=new Set([1,40000,total-1]);for(let i=0;i<total;i++)if(!missing.has(i))p.markChunk(map,i);
  assert.deepEqual(JSON.parse(JSON.stringify(p.missingRanges(map,total))),[[1,1],[40000,40000],[total-1,total-1]]);
});
test('duplicate chunk marks are idempotent and invalid ranges are rejected',async()=>{const p=await protocol(),map=new Uint8Array(1);p.markChunk(map,2);p.markChunk(map,2);assert.deepEqual([...map],[4]);assert.equal(p.validateRanges([[2,4],[4,5]],10),false);assert.equal(p.validateRanges([[2,4],[6,9]],10),true);});
test('10,000-file manifest arithmetic remains exact',()=>{const files=Array.from({length:10000},(_,i)=>({size:i+1}));const total=files.reduce((n,f)=>n+f.size,0);assert.equal(total,50005000);});
test('relative path sanitizer blocks traversal',async()=>{const p=await protocol();assert.equal(p.sanitizeRelativePath('Photos/2026/a.jpg'),'Photos/2026/a.jpg');assert.equal(p.sanitizeRelativePath('../secret.txt'),null);assert.equal(p.sanitizeRelativePath('a/../../b'),null);});
test('UTF-8 text framing stays below safe control-message payloads',async()=>{const p=await protocol(),text='😀'.repeat(20000),parts=p.splitUtf8(text,24*1024),enc=new TextEncoder();assert.ok(parts.length>1);assert.ok(parts.every(x=>enc.encode(x).byteLength<=24*1024));assert.equal(parts.join(''),text);});
test('single-byte corruption changes SHA-256',async()=>{const SHA=await sha(),a=new SHA(),b=new SHA();a.update(Uint8Array.from([1,2,3]));b.update(Uint8Array.from([1,2,4]));assert.notEqual(a.hex(),b.hex());});