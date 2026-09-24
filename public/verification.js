(() => {
  function fingerprint(desc){
    const match=desc?.sdp?.match(/^a=fingerprint:sha-256\s+([A-Fa-f0-9:]+)/mi);
    return match?match[1].replace(/:/g,'').toLowerCase():'';
  }
  async function deriveCode(localDesc,remoteDesc,subtle=crypto.subtle){
    const local=fingerprint(localDesc),remote=fingerprint(remoteDesc);if(!local||!remote)return '';
    const material=[local,remote].sort().join(':');
    const digest=new Uint8Array(await subtle.digest('SHA-256',new TextEncoder().encode(material)));
    const value=(((digest[0]*0x1000000)+(digest[1]<<16)+(digest[2]<<8)+digest[3])>>>0)%1000000;
    const code=String(value).padStart(6,'0');return `${code.slice(0,3)} ${code.slice(3)}`;
  }
  window.BlinkVerification={fingerprint,deriveCode};
})();