(() => {
  const KiB=1024,MiB=1024*1024,GiB=1024*1024*1024;
  const LIMITS=Object.freeze({
    idChars:80, fileNameChars:255, deviceNameChars:64, pathBytes:4096, pathSegments:128, pathSegmentChars:255,
    batchNameChars:255, batchFiles:10000, batchBytes:512*GiB, fileBytes:256*GiB,
    minChunkBytes:16*KiB, maxChunkBytes:64*KiB, maxChunks:4_194_304,
    resumeRanges:128, textBytes:256*KiB, textParts:64, textPartBytes:32*KiB,
    queueFiles:10000, directoryDepth:128, controlJsonBytes:512*KiB
  });
  const utf8=value=>new TextEncoder().encode(String(value??'')).byteLength;
  const validId=value=>typeof value==='string'&&value.length>0&&value.length<=LIMITS.idChars;
  function safeName(value,fallback='download'){
    if(typeof value!=='string'||value.length>LIMITS.fileNameChars)return null;
    let out=value.replace(/[\\/\x00-\x1f\x7f]/g,'_').trim()||fallback;
    if(out==='.'||out==='..')out='_';return out;
  }
  function safeRelativePath(value){
    if(value==null||value==='')return '';if(typeof value!=='string'||utf8(value)>LIMITS.pathBytes)return null;
    const parts=value.replace(/\\/g,'/').split('/').filter(Boolean);if(parts.length>LIMITS.pathSegments)return null;const safe=[];
    for(const original of parts){if(original==='.'||original==='..'||original.length>LIMITS.pathSegmentChars)return null;const part=original.replace(/[\x00-\x1f\x7f]/g,'_').trim();if(!part||part==='.'||part==='..'||part.length>LIMITS.pathSegmentChars)return null;safe.push(part);}
    return safe.join('/');
  }
  function chunkCount(size,chunkSize){if(!Number.isSafeInteger(size)||size<0||!Number.isSafeInteger(chunkSize)||chunkSize<LIMITS.minChunkBytes||chunkSize>LIMITS.maxChunkBytes)return Infinity;return Math.ceil(size/chunkSize);}
  function validFileRequest(msg){
    if(!msg||typeof msg!=='object'||!validId(msg.id))return false;if(msg.batchId!=null&&!validId(msg.batchId))return false;
    if(typeof msg.name!=='string'||msg.name.length>LIMITS.fileNameChars)return false;if(!Number.isSafeInteger(msg.size)||msg.size<0||msg.size>LIMITS.fileBytes)return false;
    const chunk=Number.isSafeInteger(msg.chunkSize)?msg.chunkSize:64*KiB;if(chunk<LIMITS.minChunkBytes||chunk>LIMITS.maxChunkBytes||chunkCount(msg.size,chunk)>LIMITS.maxChunks)return false;
    return safeRelativePath(msg.relativePath)!==null;
  }
  function validBatchRequest(msg){
    return !!msg&&typeof msg==='object'&&validId(msg.id)&&typeof msg.name==='string'&&msg.name.length<=LIMITS.batchNameChars&&
      Number.isSafeInteger(msg.count)&&msg.count>=1&&msg.count<=LIMITS.batchFiles&&Number.isSafeInteger(msg.totalSize)&&msg.totalSize>=0&&msg.totalSize<=LIMITS.batchBytes;
  }
  function validRanges(ranges,total){
    if(!Array.isArray(ranges)||ranges.length>LIMITS.resumeRanges||!Number.isSafeInteger(total)||total<0||total>LIMITS.maxChunks)return false;let last=-1;
    for(const r of ranges){if(!Array.isArray(r)||r.length!==2||!Number.isSafeInteger(r[0])||!Number.isSafeInteger(r[1])||r[0]<0||r[1]<r[0]||r[1]>=total||r[0]<=last)return false;last=r[1];}
    return true;
  }
  function validTextStart(msg){return !!msg&&validId(msg.id)&&Number.isSafeInteger(msg.parts)&&msg.parts>=1&&msg.parts<=LIMITS.textParts&&Number.isSafeInteger(msg.bytes)&&msg.bytes>=0&&msg.bytes<=LIMITS.textBytes;}
  function validTextPart(msg,state){return !!state&&!!msg&&msg.id===state.id&&Number.isSafeInteger(msg.index)&&msg.index>=0&&msg.index<state.parts.length&&typeof msg.text==='string'&&utf8(msg.text)<=LIMITS.textPartBytes;}
  function controlJsonWithinLimit(raw){return typeof raw==='string'&&utf8(raw)<=LIMITS.controlJsonBytes;}
  window.BlinkSecurity={LIMITS,utf8,validId,safeName,safeRelativePath,chunkCount,validFileRequest,validBatchRequest,validRanges,validTextStart,validTextPart,controlJsonWithinLimit};
})();