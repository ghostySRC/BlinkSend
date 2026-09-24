(() => {
  function bitmapHas(bitmap,index){return !!(bitmap?.[index>>3]&(1<<(index&7)));}
  function makePrefixBitmap(totalChunks,prefixChunks){const map=new Uint8Array(Math.ceil(totalChunks/8));for(let i=0;i<Math.min(totalChunks,prefixChunks);i++)window.BlinkProtocol.markChunk(map,i);return map;}
  async function hashPrefix(file,bytes,size){const h=new window.BlinkSHA256();let offset=0;while(offset<bytes){const part=await file.slice(offset,Math.min(bytes,offset+size)).arrayBuffer();h.update(part);offset+=part.byteLength;}return h;}
  async function hashWholeFile(file,size){return (await hashPrefix(file,file.size,size)).hex();}
  function packChunk(seq,part){const payload=new Uint8Array(part),packet=new Uint8Array(payload.length+4);new DataView(packet.buffer).setUint32(0,seq);packet.set(payload,4);return packet.buffer;}
  function unpackChunk(data){const packet=new Uint8Array(data);if(packet.byteLength<4)return null;return {seq:new DataView(packet.buffer,packet.byteOffset,packet.byteLength).getUint32(0),payload:packet.subarray(4)};}
  function makeReceiveState(size,chunkSize,receivedMap=null,nextChunk=0,received=0){
    const totalChunks=window.BlinkSecurity.chunkCount(size,chunkSize);if(!Number.isFinite(totalChunks)||totalChunks>window.BlinkSecurity.LIMITS.maxChunks)return null;
    const needed=Math.ceil(totalChunks/8),map=receivedMap instanceof Uint8Array&&receivedMap.byteLength===needed?receivedMap:new Uint8Array(needed);
    return {size,chunkSize,totalChunks,receivedMap:map,nextChunk:Math.min(Math.max(0,nextChunk|0),totalChunks),received:Math.min(Math.max(0,Number(received)||0),size)};
  }
  function inspectChunk(state,seq,bytes){
    if(!state||!Number.isSafeInteger(seq)||seq<0||seq>=state.totalChunks||!Number.isSafeInteger(bytes)||bytes<0)return {ok:false,reason:'range'};
    if(bitmapHas(state.receivedMap,seq))return {ok:true,duplicate:true,offset:seq*state.chunkSize};
    const offset=seq*state.chunkSize,expected=Math.min(state.chunkSize,state.size-offset);if(bytes!==expected)return {ok:false,reason:'size',offset,expected};
    return {ok:true,duplicate:false,offset,expected};
  }
  function commitChunk(state,seq,bytes){
    const check=inspectChunk(state,seq,bytes);if(!check.ok||check.duplicate)return check;
    window.BlinkProtocol.markChunk(state.receivedMap,seq);state.received+=bytes;while(state.nextChunk<state.totalChunks&&bitmapHas(state.receivedMap,state.nextChunk))state.nextChunk++;return {...check,committed:true};
  }
  function missingRanges(state){return window.BlinkProtocol.missingRanges(state.receivedMap,state.totalChunks);}
  function finalHash(state){if(typeof state?.fullHash==='string'&&/^[a-f0-9]{64}$/.test(state.fullHash))return state.fullHash;return state?.hasher&&typeof state.hasher.hex==='function'?state.hasher.hex():'';}
  window.BlinkTransfer={bitmapHas,makePrefixBitmap,hashPrefix,hashWholeFile,packChunk,unpackChunk,makeReceiveState,inspectChunk,commitChunk,missingRanges,finalHash};
})();