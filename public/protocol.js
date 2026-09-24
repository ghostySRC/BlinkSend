(() => {
  const KiB=1024, MiB=1024*1024;
  function chooseTuning({throughputBps=0,rttMs=0,deviceMemory=4,cores=4,maxMessageSize=0}={}){
    const weak=(deviceMemory&&deviceMemory<=2)||(cores&&cores<=2);
    const negotiated=Number.isFinite(maxMessageSize)&&maxMessageSize>8?maxMessageSize-4:64*KiB;
    const chunkCap=Math.min(256*KiB,negotiated);
    let preferred=weak?64*KiB:throughputBps>=24*MiB?256*KiB:throughputBps>=6*MiB?192*KiB:128*KiB;
    if(!throughputBps&&!weak)preferred=128*KiB;
    const chunkSize=Math.max(16*KiB,Math.min(preferred,chunkCap));
    let highWater=weak?8*MiB:16*MiB;
    if(throughputBps>20*MiB&&!weak)highWater=24*MiB;
    if(throughputBps>50*MiB&&!weak&&rttMs<100)highWater=32*MiB;
    if(rttMs>180)highWater=Math.min(highWater,12*MiB);
    const readAhead=weak?2*MiB:throughputBps>20*MiB?16*MiB:8*MiB;
    const writeBatch=weak?MiB:throughputBps>10*MiB?8*MiB:4*MiB;
    let receiveWindow=weak?8*MiB:throughputBps>25*MiB?48*MiB:throughputBps>8*MiB?32*MiB:24*MiB;
    if(rttMs>180)receiveWindow=Math.min(receiveWindow,16*MiB);
    return {
      chunkSize,highWater,lowWater:Math.max(MiB,Math.floor(highWater/4)),
      readAhead,writeBatch,receiveWindow,flowAckBytes:Math.max(MiB,Math.floor(receiveWindow/8)),
      checkpointBytes:128*MiB,uiIntervalMs:100
    };
  }
  function formatEta(seconds){
    if(!Number.isFinite(seconds)||seconds<0)return '';
    seconds=Math.ceil(seconds);
    if(seconds<60)return `${seconds}s`;
    const m=Math.floor(seconds/60),s=seconds%60;
    if(m<60)return s?`${m}m ${s}s`:`${m}m`;
    const h=Math.floor(m/60),rm=m%60;return rm?`${h}h ${rm}m`:`${h}h`;
  }
  function updateTransferEstimate(previous,{bytes=0,total=0,started=0,label='',now=0,windowMs=8000,minSpanMs=700,sampleIntervalMs=250}={}){
    bytes=Math.max(0,Number(bytes)||0);total=Math.max(bytes,Number(total)||0);now=Number(now)||0;
    const compatible=previous&&previous.label===label&&bytes>=previous.bytes&&Array.isArray(previous.samples)&&now-(previous.sampleAt||now)<=3000;
    const samples=compatible?previous.samples.slice(-32):[];
    const last=samples[samples.length-1];
    if(!last||now-last.at>=sampleIntervalMs||bytes>=total)samples.push({at:now,bytes});
    const cutoff=now-windowMs;
    while(samples.length>2&&samples[1].at<=cutoff)samples.shift();
    const first=samples[0]||{at:now,bytes},spanMs=Math.max(0,now-first.at),moved=Math.max(0,bytes-first.bytes);
    let speed=0,etaSeconds=Infinity;
    if(spanMs>=minSpanMs&&moved>0){
      speed=moved/(spanMs/1000);
      if(Number.isFinite(speed)&&speed>0)etaSeconds=Math.max(0,(total-bytes)/speed);else speed=0;
    }
    return {bytes,total,started,label,speed,etaSeconds,samples,sampleAt:now};
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
  function splitUtf8(text,maxBytes=24*KiB){
    text=String(text||'');if(!text)return [];const enc=new TextEncoder(),out=[];let part='',bytes=0;
    for(const ch of text){const n=enc.encode(ch).byteLength;if(n>maxBytes)throw new Error('character exceeds chunk size');if(bytes+n>maxBytes&&part){out.push(part);part='';bytes=0;}part+=ch;bytes+=n;}if(part)out.push(part);return out;
  }
  window.BlinkProtocol={chooseTuning,formatEta,updateTransferEstimate,connectionQuality,missingRanges,markChunk,splitUtf8};
})();