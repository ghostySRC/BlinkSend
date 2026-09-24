importScripts('/sha256.js');

let currentId='';
let cancelled=false;

async function hashFile(id,file,chunkBytes){
  if(!(file instanceof Blob))throw new Error('Invalid file');
  const size=file.size,block=Math.max(1024*1024,Math.min(32*1024*1024,Number(chunkBytes)||16*1024*1024));
  const hasher=new BlinkSHA256();
  const started=performance.now();
  let offset=0,lastProgress=0;
  while(offset<size){
    if(cancelled||currentId!==id)throw new Error('Hash cancelled');
    const end=Math.min(size,offset+block);
    const buffer=await file.slice(offset,end).arrayBuffer();
    if(cancelled||currentId!==id)throw new Error('Hash cancelled');
    hasher.update(new Uint8Array(buffer));
    offset=end;
    if(offset-lastProgress>=64*1024*1024||offset===size){
      lastProgress=offset;
      postMessage({type:'progress',id,bytes:offset,total:size});
    }
  }
  return {sha256:hasher.hex(),ms:performance.now()-started};
}

onmessage=async event=>{
  const msg=event.data||{};
  if(msg.type==='cancel'){
    if(!msg.id||msg.id===currentId)cancelled=true;
    return;
  }
  if(msg.type!=='hash'||typeof msg.id!=='string')return;
  currentId=msg.id;cancelled=false;
  try{
    const result=await hashFile(msg.id,msg.file,msg.chunkBytes);
    if(!cancelled&&currentId===msg.id)postMessage({type:'done',id:msg.id,...result});
  }catch(error){
    if(!cancelled&&currentId===msg.id)postMessage({type:'error',id:msg.id,message:String(error?.message||error)});
  }
};
