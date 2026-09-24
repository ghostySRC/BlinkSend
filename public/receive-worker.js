importScripts('/sha256.js');

let handle=null;
let access=null;
let writable=null;
let backend='';
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

async function hashPrefix(bytes){
  hasher=new BlinkSHA256();hashDirty=false;nextHashOffset=0;
  if(!(bytes>0))return;
  if(access){
    const blockSize=8*1024*1024,buffer=new Uint8Array(blockSize);
    let offset=0;
    while(offset<bytes){
      const length=Math.min(blockSize,bytes-offset),view=length===buffer.byteLength?buffer:buffer.subarray(0,length);
      const read=access.read(view,{at:offset});
      if(read!==length)throw new Error('Could not rebuild OPFS hash state');
      hasher.update(view);offset+=read;
    }
    nextHashOffset=bytes;return;
  }
  const file=await handle.getFile(),blockSize=8*1024*1024;
  let offset=0;
  while(offset<bytes){
    const end=Math.min(bytes,offset+blockSize),buffer=await file.slice(offset,end).arrayBuffer();
    hasher.update(new Uint8Array(buffer));offset=end;
  }
  nextHashOffset=bytes;
}

async function openBackend(fileHandle,{truncate=false,resumeBytes=0}={}){
  handle=fileHandle;
  backend='';
  try{
    access=await handle.createSyncAccessHandle();
    backend='sync';
    if(truncate)access.truncate(0);
    await hashPrefix(resumeBytes);
    return;
  }catch{
    access=null;
  }
  // createWritable() is also available in dedicated workers in current browsers.
  // Keep it in the worker so the page main thread never becomes the storage hot path.
  if(resumeBytes>0)await hashPrefix(resumeBytes);else{hasher=new BlinkSHA256();hashDirty=false;nextHashOffset=0;}
  writable=await handle.createWritable({keepExistingData:!truncate});
  backend='stream';
}

async function init(fileHandle,{truncate=false,resumeBytes=0}={}){
  await openBackend(fileHandle,{truncate,resumeBytes});
  initialized=true;
  postMessage({type:'ready',backend});
}

async function writeBatch(start,total,entries){
  if(!initialized||(!access&&!writable))throw new Error('Worker is not initialized');
  if(!Number.isSafeInteger(start)||start<0||!Number.isSafeInteger(total)||total<0||!Array.isArray(entries))throw new Error('Invalid write batch');
  const target=ensureScratch(total);
  let cursor=0;
  const started=performance.now();
  for(const entry of entries){
    const byteOffset=Number(entry.byteOffset)||0,byteLength=Number(entry.byteLength)||0;
    if(!(entry.buffer instanceof ArrayBuffer)||byteOffset<0||byteLength<0||byteOffset+byteLength>entry.buffer.byteLength)throw new Error('Invalid write entry');
    target.set(new Uint8Array(entry.buffer,byteOffset,byteLength),cursor);cursor+=byteLength;
  }
  if(cursor!==total)throw new Error('Write batch length mismatch');
  const view=target.subarray(0,total);
  let written;
  if(access){
    written=access.write(view,{at:start});
    if(written!==view.byteLength)throw new Error('Short OPFS write');
  }else{
    await writable.write({type:'write',position:start,data:view});
    written=view.byteLength;
  }
  if(!hashDirty&&start===nextHashOffset){
    hasher.update(view);nextHashOffset+=view.byteLength;
  }else if(start!==nextHashOffset){
    hashDirty=true;
  }
  return {bytes:written,writeMs:performance.now()-started,backend};
}

async function durableCheckpoint(){
  if(access){access.flush();return;}
  if(writable){
    await writable.close();
    writable=await handle.createWritable({keepExistingData:true});
  }
}

async function closeBackend(strict=false){
  if(access){
    try{access.flush();access.close();}catch(error){access=null;if(strict)throw error;}
    access=null;
  }
  if(writable){
    const current=writable;writable=null;
    try{await current.close();}catch(error){if(strict)throw error;}
  }
}

async function hashWhole(size){
  const h=new BlinkSHA256(),blockSize=8*1024*1024;
  if(access){
    const buffer=new Uint8Array(blockSize);let offset=0;
    while(offset<size){
      const length=Math.min(blockSize,size-offset),view=length===buffer.byteLength?buffer:buffer.subarray(0,length);
      const read=access.read(view,{at:offset});if(read!==length)throw new Error('Short OPFS read while verifying');
      h.update(view);offset+=read;
    }
    return h.hex();
  }
  if(writable){await writable.close();writable=null;}
  const file=await handle.getFile();let offset=0;
  while(offset<size){
    const end=Math.min(size,offset+blockSize),buffer=await file.slice(offset,end).arrayBuffer();
    if(buffer.byteLength!==end-offset)throw new Error('Short OPFS read while verifying');
    h.update(new Uint8Array(buffer));offset=end;
  }
  return h.hex();
}

async function reset(){
  await closeBackend();
  await openBackend(handle,{truncate:true,resumeBytes:0});
}

onmessage=async event=>{
  const msg=event.data||{};
  try{
    if(msg.type==='init'){
      await init(msg.handle,{truncate:!!msg.truncate,resumeBytes:Number(msg.resumeBytes)||0});
      return;
    }
    if(msg.type==='write-batch'){
      const result=await writeBatch(Number(msg.start)||0,Number(msg.total)||0,msg.entries||[]);
      postMessage({type:'written',id:msg.id,...result});
      return;
    }
    if(msg.type==='flush'){
      await durableCheckpoint();
      postMessage({type:'flushed',id:msg.id,backend});
      return;
    }
    if(msg.type==='reset'){
      await reset();
      postMessage({type:'reset',id:msg.id,backend});
      return;
    }
    if(msg.type==='finalize'){
      const size=Number(msg.size)||0;
      if(access)access.flush();
      const hash=!hashDirty&&nextHashOffset===size?hasher.hex():await hashWhole(size);
      await closeBackend(true);initialized=false;
      postMessage({type:'finalized',id:msg.id,hash,backend});
      return;
    }
    if(msg.type==='close'){
      await closeBackend();initialized=false;
      postMessage({type:'closed',id:msg.id});
    }
  }catch(error){
    await closeBackend().catch(()=>{});
    initialized=false;
    postMessage({type:'error',id:msg.id||'',message:String(error?.message||error)});
  }
};
