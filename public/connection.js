(() => {
  function selectedPair(stats){
    let pair;
    for(const item of stats.values()){
      if(item.type==='transport'&&item.selectedCandidatePairId)pair=stats.get(item.selectedCandidatePairId);
      if(!pair&&item.type==='candidate-pair'&&item.nominated&&item.state==='succeeded')pair=item;
    }
    return pair||null;
  }
  function summarize(stats){
    const pair=selectedPair(stats);if(!pair)return {pair:null,relayed:false,rttMs:0,localType:'',remoteType:''};
    const local=stats.get(pair.localCandidateId),remote=stats.get(pair.remoteCandidateId);
    const rttSec=pair.currentRoundTripTime||(pair.totalRoundTripTime&&pair.responsesReceived?pair.totalRoundTripTime/pair.responsesReceived:0)||0;
    return {pair,relayed:local?.candidateType==='relay'||remote?.candidateType==='relay',rttMs:Math.round(rttSec*1000),localType:local?.candidateType||'',remoteType:remote?.candidateType||''};
  }
  window.BlinkConnection={selectedPair,summarize};
})();