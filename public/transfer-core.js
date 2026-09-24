(() => {
  function bitmapHas(bitmap,index){return !!(bitmap?.[index>>3]&(1<<(index&7)));}
  function makePrefixBitmap(totalChunks,prefixChunks){const map=new Uint8Array(Math.ceil(totalChunks/8));for(let i=0;i<Math.min(totalChunks,prefixChunks);i++)BlinkProtocol.markChunk(map,i);return map;}
  async function hashPrefix(file,bytes,size){const h=new BlinkSHA256();let offset=0;while(offset<bytes){const part=await file.slice(offset,Math.min(bytes,offset+size)).arrayBuffer();h.update(part);offset+=part.byteLength;}return h;}
  async function hashWholeFile(file,size){return (await hashPrefix(file,file.size,size)).hex();}
  function packChunk(seq,part){const payload=new Uint8Array(part),packet=new Uint8Array(payload.length+4);new DataView(packet.buffer).setUint32(0,seq);packet.set(payload,4);return packet.buffer;}
  function unpackChunk(data){const packet=new Uint8Array(data);if(packet.byteLength<4)return null;return {seq:new DataView(packet.buffer,packet.byteOffset,packet.byteLength).getUint32(0),payload:packet.subarray(4)};}
  window.BlinkTransfer={bitmapHas,makePrefixBitmap,hashPrefix,hashWholeFile,packChunk,unpackChunk};
})();