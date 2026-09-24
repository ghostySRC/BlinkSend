importScripts('/sha256.js');

let access=null;
let hasher=null;
let hashDirty=false;
let nextHashOffset=0;
let initialized=false;

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

function writeBatch(entries){
  if(!initialized||!access)throw new Error('Worker is not initialized');
  let bytes=0;
  for(const entry of entries){
    const view=new Uint8Array(entry.buffer,entry.byteOffset||0,entry.byteLength);
    const written=access.write(view,{at:entry.offset});
    if(written!==view.byteLength)throw new Error('Short OPFS write');
    if(!hashDirty&&entry.offset===nextHashOffset){
      hasher.update(view);
      nextHashOffset+=view.byteLength;
    }else if(entry.offset!==nextHashOffset){
      hashDirty=true;
    }
    bytes+=view.byteLength;
  }
  return bytes;
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
    if(msg.type==='write'){
      const bytes=writeBatch(msg.entries||[]);
      postMessage({type:'written',id:msg.id,bytes});
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
