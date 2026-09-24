import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';
const src=await readFile(new URL('../public/protocol.js',import.meta.url),'utf8'),ctx={window:{},TextEncoder};vm.createContext(ctx);vm.runInContext(src,ctx);const p=ctx.window.BlinkProtocol;
const chunk=64*1024,total=Math.ceil((5*1024**3)/chunk),map=new Uint8Array(Math.ceil(total/8));
let t=performance.now();for(let i=0;i<total;i++)if(i%997)p.markChunk(map,i);const markMs=performance.now()-t;
t=performance.now();const ranges=p.missingRanges(map,total),rangeMs=performance.now()-t;
const files=Array.from({length:10000},(_,i)=>({name:`file-${i}`,size:(i%1000)+1}));t=performance.now();const bytes=files.reduce((n,f)=>n+f.size,0);const manifestMs=performance.now()-t;
console.log(JSON.stringify({fiveGiBChunks:total,bitmapBytes:map.byteLength,missingRanges:ranges.length,markMs:+markMs.toFixed(2),rangeScanMs:+rangeMs.toFixed(2),manifestFiles:files.length,manifestBytes:bytes,manifestMs:+manifestMs.toFixed(2)},null,2));