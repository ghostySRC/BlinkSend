(() => {
  const KiB=1024, MiB=1024*1024;
  function chooseTuning({throughputBps=0,rttMs=0,deviceMemory=4,cores=4}={}){
    const weak=(deviceMemory&&deviceMemory<=2)||(cores&&cores<=2);
    const chunkSize=weak?32*KiB:64*KiB;
    let highWater=weak?2*MiB:8*MiB;
    if(throughputBps>35*MiB&&!weak&&rttMs<80)highWater=16*MiB;
    if(throughputBps>80*MiB&&!weak&&rttMs<40)highWater=24*MiB;
    if(rttMs>180)highWater=Math.min(highWater,4*MiB);
    return {chunkSize,highWater,lowWater:Math.max(512*KiB,Math.floor(highWater/4))};
  }
  function formatEta(seconds){
    if(!Number.isFinite(seconds)||seconds<0)return '';
    seconds=Math.ceil(seconds);
    if(seconds<60)return `${seconds}s`;
    const m=Math.floor(seconds/60),s=seconds%60;
    if(m<60)return s?`${m}m ${s}s`:`${m}m`;
    const h=Math.floor(m/60),rm=m%60;return rm?`${h}h ${rm}m`:`${h}h`;
  }
  function connectionQuality({rttMs=0,throughputBps=0,relayed=false}={}){
    if(!rttMs&&!throughputBps)return 'unknown';
    if(rttMs>300||(throughputBps&&throughputBps<512*KiB))return 'poor';
    if(rttMs>150||(throughputBps&&throughputBps<3*MiB))return 'fair';
    if(rttMs<60&&(!throughputBps||throughputBps>15*MiB))return relayed?'good':'excellent';
    return 'good';
  }
  function missingRanges(bitmap,totalChunks){
    const has=i=>!!(bitmap[i>>3]&(1<<(i&7)));
    const out=[];let start=-1;
    for(let i=0;i<totalChunks;i++){
      if(!has(i)&&start<0)start=i;
      if((has(i)||i===totalChunks-1)&&start>=0){const end=has(i)?i-1:i;out.push([start,end]);start=-1;}
    }
    return out;
  }
  function markChunk(bitmap,index){bitmap[index>>3]|=1<<(index&7);return bitmap;}
  function validateRanges(ranges,total){
    if(!Array.isArray(ranges)||ranges.length>128||!Number.isSafeInteger(total)||total<0)return false;let last=-1;
    for(const r of ranges){if(!Array.isArray(r)||r.length!==2||!Number.isSafeInteger(r[0])||!Number.isSafeInteger(r[1])||r[0]<0||r[1]<r[0]||r[1]>=total||r[0]<=last)return false;last=r[1];}
    return true;
  }
  function sanitizeRelativePath(value){
    if(value==null||value==='')return '';if(typeof value!=='string'||value.length>4096)return null;
    const raw=value.replace(/\\/g,'/').split('/').filter(Boolean);if(raw.length>128)return null;const safe=[];
    for(const original of raw){if(original==='.'||original==='..')return null;const part=original.replace(/[\x00-\x1f\x7f]/g,'_').trim();if(!part||part==='.'||part==='..'||part.length>255)return null;safe.push(part);}
    return safe.join('/');
  }
  function splitUtf8(text,maxBytes=24*KiB){
    text=String(text||'');if(!text)return [];const enc=new TextEncoder(),out=[];let part='',bytes=0;
    for(const ch of text){const n=enc.encode(ch).byteLength;if(n>maxBytes)throw new Error('character exceeds chunk size');if(bytes+n>maxBytes&&part){out.push(part);part='';bytes=0;}part+=ch;bytes+=n;}if(part)out.push(part);return out;
  }
  window.BlinkProtocol={chooseTuning,formatEta,connectionQuality,missingRanges,markChunk,validateRanges,sanitizeRelativePath,splitUtf8};
})();