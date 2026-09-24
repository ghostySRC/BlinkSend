importScripts('/sha256.js');

let access=null;
let hasher=null;
let hashDirty=false;
let nextHashOffset=0;
let initialized=false;
let scratch=new Uint8Array(0);

function ensureScratch(bytes){
  if(scratch.byteLength>=bytes)return scratch;
  let size=1024*1024;
  while(size<bytes)size*=2;
  scratch=new Uint8Array(size);
  return scratch;
}

async function init(handle,{truncate=false,resumeBytes=0}={}){
  access=await handle.createSyncAccessHandle();
  if(truncate)access.truncate(0);
  hasher=new BlinkSHA256();
  hashDirty=false;
  nextHashOffset=0;
  if(resumeBytes>0){
    const blockSize=8*1024*1024;
    const buffer=new Uint8Array(blockSize);
    let offset=0;
    while(offset<resumeBytes){
      const length=Math.min(blockSize,resumeBytes-offset);
      const view=length===buffer.byteLength?buffer:buffer.subarray(0,length);
      const read=access.read(view,{at:offset});
      if(read!==length)throw new Error('Could not rebuild OPFS hash state');
      hasher.update(view);
      offset+=read;
    }
    nextHashOffset=resumeBytes;
  }
  initialized=true;
  postMessage({type:'ready'});
}

function writeBatch(start,total,entries){
  if(!initialized||!access)throw new Error('Worker is not initialized');
  if(!Number.isSafeInteger(start)||start<0||!Number.isSafeInteger(total)||total<0||!Array.isArray(entries))throw new Error('Invalid write batch');
  const target=ensureScratch(total);
  let cursor=0;
  const started=performance.now();
  for(const entry of entries){
    const byteOffset=Number(entry.byteOffset)||0,byteLength=Number(entry.byteLength)||0;
    if(!(entry.buffer instanceof ArrayBuffer)||byteOffset<0||byteLength<0||byteOffset+byteLength>entry.buffer.byteLength)throw new Error('Invalid write entry');
    const view=new Uint8Array(entry.buffer,byteOffset,byteLength);
    target.set(view,cursor);cursor+=byteLength;
  }
  if(cursor!==total)throw new Error('Write batch length mismatch');
  const view=target.subarray(0,total);
  const written=access.write(view,{at:start});
  if(written!==view.byteLength)throw new Error('Short OPFS write');
  if(!hashDirty&&start===nextHashOffset){
    hasher.update(view);
    nextHashOffset+=view.byteLength;
  }else if(start!==nextHashOffset){
    hashDirty=true;
  }
  return {bytes:view.byteLength,writeMs:performance.now()-started};
}

function hashWhole(size){
  const blockSize=8*1024*1024,buffer=new Uint8Array(blockSize),h=new BlinkSHA256();
  let offset=0;
  while(offset<size){
    const length=Math.min(blockSize,size-offset);
    const view=length===buffer.byteLength?buffer:buffer.subarray(0,length);
    const read=access.read(view,{at:offset});
    if(read!==length)throw new Error('Short OPFS read while verifying');
    h.update(view);
    offset+=read;
  }
  return h.hex();
}

onmessage=async event=>{
  const msg=event.data||{};
  try{
    if(msg.type==='init'){
      await init(msg.handle,{truncate:!!msg.truncate,resumeBytes:Number(msg.resumeBytes)||0});
      return;
    }
    if(msg.type==='write-batch'){
      const result=writeBatch(Number(msg.start)||0,Number(msg.total)||0,msg.entries||[]);
      postMessage({type:'written',id:msg.id,...result});
      return;
    }
    if(msg.type==='flush'){
      access?.flush();
      postMessage({type:'flushed',id:msg.id});
      return;
    }
    if(msg.type==='reset'){
      access?.truncate(0);
      hasher=new BlinkSHA256();hashDirty=false;nextHashOffset=0;
      postMessage({type:'reset',id:msg.id});
      return;
    }
    if(msg.type==='finalize'){
      const size=Number(msg.size)||0;
      access?.flush();
      const hash=!hashDirty&&nextHashOffset===size?hasher.hex():hashWhole(size);
      access?.close();access=null;initialized=false;
      postMessage({type:'finalized',id:msg.id,hash});
      return;
    }
    if(msg.type==='close'){
      try{access?.flush();}catch{}
      try{access?.close();}catch{}
      access=null;initialized=false;
      postMessage({type:'closed',id:msg.id});
    }
  }catch(error){
    try{access?.close();}catch{}
    access=null;initialized=false;
    postMessage({type:'error',id:msg.id||'',message:String(error?.message||error)});
  }
};
