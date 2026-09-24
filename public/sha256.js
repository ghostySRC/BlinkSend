(() => {
  const K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);
  const rotr = (x,n) => (x >>> n) | (x << (32-n));
  class SHA256 {
    constructor() {
      this.h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
      this.buffer = new Uint8Array(64); this.bufferLength = 0; this.bytesHashed = 0; this.finished = false;
      this.w = new Uint32Array(64);
    }
    update(input) {
      if (this.finished) throw new Error('SHA256 already finalized');
      const data = input instanceof Uint8Array ? input : new Uint8Array(input);
      this.bytesHashed += data.length;
      let pos = 0;
      if (this.bufferLength) {
        const take = Math.min(64 - this.bufferLength, data.length);
        this.buffer.set(data.subarray(0, take), this.bufferLength);
        this.bufferLength += take; pos = take;
        if (this.bufferLength === 64) { this._compress(this.buffer); this.bufferLength = 0; }
      }
      while (pos + 64 <= data.length) {
        this._compress(data.subarray(pos, pos + 64));
        pos += 64;
      }
      if (pos < data.length) {
        const tail=data.subarray(pos);
        this.buffer.set(tail,0);this.bufferLength=tail.length;
      }
      return this;
    }
    _compress(chunk) {
      const w = this.w;
      for (let i=0;i<16;i++) {
        const j=i*4; w[i]=((chunk[j]<<24)|(chunk[j+1]<<16)|(chunk[j+2]<<8)|chunk[j+3])>>>0;
      }
      for (let i=16;i<64;i++) {
        const a=w[i-15], b=w[i-2];
        const s0=rotr(a,7)^rotr(a,18)^(a>>>3), s1=rotr(b,17)^rotr(b,19)^(b>>>10);
        w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;
      }
      let [a,b,c,d,e,f,g,h]=this.h;
      for (let i=0;i<64;i++) {
        const S1=rotr(e,6)^rotr(e,11)^rotr(e,25), ch=(e&f)^(~e&g);
        const t1=(h+S1+ch+K[i]+w[i])>>>0;
        const S0=rotr(a,2)^rotr(a,13)^rotr(a,22), maj=(a&b)^(a&c)^(b&c);
        const t2=(S0+maj)>>>0;
        h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
      }
      const v=[a,b,c,d,e,f,g,h];
      for (let i=0;i<8;i++) this.h[i]=(this.h[i]+v[i])>>>0;
    }
    digest() {
      if (!this.finished) {
        const bits = this.bytesHashed * 8;
        this.buffer[this.bufferLength++] = 0x80;
        if (this.bufferLength > 56) {
          this.buffer.fill(0, this.bufferLength); this._compress(this.buffer); this.bufferLength = 0;
        }
        this.buffer.fill(0, this.bufferLength, 56);
        const hi = Math.floor(bits / 0x100000000), lo = bits >>> 0;
        this.buffer[56]=(hi>>>24)&255; this.buffer[57]=(hi>>>16)&255; this.buffer[58]=(hi>>>8)&255; this.buffer[59]=hi&255;
        this.buffer[60]=(lo>>>24)&255; this.buffer[61]=(lo>>>16)&255; this.buffer[62]=(lo>>>8)&255; this.buffer[63]=lo&255;
        this._compress(this.buffer); this.finished = true;
      }
      const out = new Uint8Array(32);
      for (let i=0;i<8;i++) { const v=this.h[i]; out[i*4]=v>>>24; out[i*4+1]=v>>>16; out[i*4+2]=v>>>8; out[i*4+3]=v; }
      return out;
    }
    hex() { return [...this.digest()].map(v=>v.toString(16).padStart(2,'0')).join(''); }
  }
  window.BlinkSHA256 = SHA256;
})();