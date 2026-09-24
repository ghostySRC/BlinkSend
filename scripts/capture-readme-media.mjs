import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const media=path.join(root,'docs','media');
const tmp=path.join(root,'.readme-capture');
await rm(tmp,{recursive:true,force:true});
await mkdir(tmp,{recursive:true});
await mkdir(media,{recursive:true});

const port=3127;
const base=\`http://127.0.0.1:\${port}\`;
const server=spawn(process.execPath,['server.js'],{
  cwd:root,
  env:{...process.env,PORT:String(port),LOG_LEVEL:'silent'},
  stdio:['ignore','pipe','pipe']
});

async function waitForServer(){
  for(let i=0;i<80;i++){
    try{const r=await fetch(base+'/health');if(r.ok)return;}catch{}
    await new Promise(r=>setTimeout(r,100));
  }
  throw new Error('BlinkSend server did not become ready');
}
await waitForServer();

const browser=await chromium.launch({headless:true});

async function overlay(page){
  await page.evaluate(()=>{
    const style=document.createElement('style');
    style.textContent=\`
      #doc-cursor{position:fixed;left:0;top:0;z-index:2147483647;width:44px;height:52px;pointer-events:none;transform:translate3d(48px,48px,0);transition:transform .55s cubic-bezier(.22,.9,.24,1);filter:drop-shadow(0 2px 2px #0006)}
      #doc-cursor svg{width:44px;height:52px;display:block}
      #doc-label{position:fixed;z-index:2147483646;left:0;top:0;pointer-events:none;background:#206a59;color:white;border-radius:999px;padding:7px 11px;font:700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;opacity:0;transform:translate3d(80px,40px,0);transition:transform .55s cubic-bezier(.22,.9,.24,1),opacity .18s}
      .doc-ripple{position:fixed;z-index:2147483645;width:18px;height:18px;margin:-9px 0 0 -9px;border:4px solid #206a59;border-radius:50%;pointer-events:none;animation:docRipple .45s ease-out forwards}
      @keyframes docRipple{to{width:70px;height:70px;margin:-35px 0 0 -35px;opacity:0}}
    \`;
    document.head.append(style);
    const c=document.createElement('div');c.id='doc-cursor';
    c.innerHTML='<svg viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg"><path d="M4 3 L8 39 L17 29 L27 47 L36 42 L25 25 L40 22 Z" fill="white" stroke="#11181b" stroke-width="3" stroke-linejoin="round"/></svg>';
    const l=document.createElement('div');l.id='doc-label';
    document.body.append(c,l);
  });
}
async function move(page,x,y,label='',ms=550){
  await page.evaluate(({x,y,label,ms})=>{
    const c=document.querySelector('#doc-cursor'),l=document.querySelector('#doc-label');
    c.style.transitionDuration=ms+'ms';l.style.transitionDuration=ms+'ms';
    c.style.transform=\`translate3d(\${x}px,\${y}px,0)\`;
    l.textContent=label;l.style.opacity=label?'1':'0';
    l.style.transform=\`translate3d(\${Math.min(innerWidth-190,x+45)}px,\${Math.max(8,y-18)}px,0)\`;
  },{x,y,label,ms});
  await page.waitForTimeout(ms+80);
}
async function ripple(page,x,y){
  await page.evaluate(({x,y})=>{
    const r=document.createElement('div');r.className='doc-ripple';r.style.left=x+'px';r.style.top=y+'px';document.body.append(r);setTimeout(()=>r.remove(),600);
  },{x,y});
  await page.waitForTimeout(80);
}
async function clickAt(page,selector,label){
  const el=page.locator(selector);
  const box=await el.boundingBox();
  if(!box)throw new Error('No box for '+selector);
  const x=Math.round(box.x+box.width/2),y=Math.round(box.y+box.height/2);
  await move(page,x,y,label,620);await ripple(page,x,y);await el.click();await page.waitForTimeout(500);
}
async function closeWithVideo(ctx,page){
  const video=page.video();
  await ctx.close();
  return video?await video.path():null;
}
function ff(args){
  const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
  if(r.status!==0)throw new Error('ffmpeg failed: '+args.join(' '));
}
function gifSingle(input,output){
  ff(['-i',input,'-filter_complex',
    '[0:v]fps=30,scale=720:-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3[out]',
    '-map','[out]','-loop','0',output]);
}
function gifPair(a,b,output){
  ff(['-i',a,'-i',b,'-filter_complex',
    '[0:v]fps=30,scale=360:406:force_original_aspect_ratio=decrease,pad=360:406:(ow-iw)/2:(oh-ih)/2:#f6f7f8[a];'+
    '[1:v]fps=30,scale=360:406:force_original_aspect_ratio=decrease,pad=360:406:(ow-iw)/2:(oh-ih)/2:#f6f7f8[b];'+
    '[a][b]hstack=inputs=2,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3[out]',
    '-map','[out]','-shortest','-loop','0',output]);
}

async function staticShots(){
  const ctx=await browser.newContext({viewport:{width:1280,height:820},deviceScaleFactor:1});
  const p=await ctx.newPage();await p.goto(base,{waitUntil:'networkidle'});await p.screenshot({path:path.join(media,'desktop.webp'),type:'webp',quality:88,fullPage:false});await ctx.close();

  const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true});
  const m=await mobile.newPage();await m.goto(base,{waitUntil:'networkidle'});await m.screenshot({path:path.join(media,'mobile.webp'),type:'webp',quality:88});
  await m.locator('#theme-toggle').click();await m.waitForTimeout(250);await m.screenshot({path:path.join(media,'mobile-dark.webp'),type:'webp',quality:88});await mobile.close();
}

async function makePair(){
  const opts={viewport:{width:540,height:610},recordVideo:{dir:tmp,size:{width:540,height:610}}};
  const sctx=await browser.newContext(opts),rctx=await browser.newContext(opts);
  const s=await sctx.newPage(),r=await rctx.newPage();
  await Promise.all([s.goto(base,{waitUntil:'networkidle'}),r.goto(base,{waitUntil:'networkidle'})]);
  await Promise.all([overlay(s),overlay(r)]);
  await clickAt(s,'#mode-send','Send');
  await s.locator('#pair-code-wrap').waitFor({state:'visible'});
  const code=(await s.locator('#pair-code').textContent()).trim();
  await clickAt(r,'#mode-receive','Receive');
  await move(r,165,285,'Type pairing code',500);
  await r.locator('#join-code').fill(code);
  await clickAt(r,'#join-code-button','Use code');
  await Promise.all([s.locator('#verify-peer').waitFor({state:'visible'}),r.locator('#verify-peer').waitFor({state:'visible'})]);
  await move(s,145,350,'Compare codes',650);await move(r,145,350,'Same code',650);
  await clickAt(s,'#verify-match','Codes match');
  await clickAt(r,'#verify-match','Codes match');
  await s.waitForTimeout(1800);await r.waitForTimeout(1800);
  const [sv,rv]=await Promise.all([closeWithVideo(sctx,s),closeWithVideo(rctx,r)]);
  gifPair(sv,rv,path.join(media,'pairing.gif'));
}

async function pairedSessionWithTransfer(){
  const opts={viewport:{width:540,height:610},recordVideo:{dir:tmp,size:{width:540,height:610}}};
  const init=()=>{try{Object.defineProperty(window,'showSaveFilePicker',{value:undefined,configurable:true});Object.defineProperty(navigator.storage,'getDirectory',{value:undefined,configurable:true});}catch{}};
  const sctx=await browser.newContext(opts),rctx=await browser.newContext(opts);
  await sctx.addInitScript(init);await rctx.addInitScript(init);
  const s=await sctx.newPage(),r=await rctx.newPage();
  await Promise.all([s.goto(base,{waitUntil:'networkidle'}),r.goto(base,{waitUntil:'networkidle'})]);
  await Promise.all([overlay(s),overlay(r)]);
  await s.locator('#mode-send').click();await s.locator('#pair-code-wrap').waitFor({state:'visible'});
  const code=(await s.locator('#pair-code').textContent()).trim();
  await r.locator('#mode-receive').click();await r.locator('#join-code').fill(code);await r.locator('#join-code-button').click();
  await Promise.all([s.locator('#verify-peer').waitFor({state:'visible'}),r.locator('#verify-peer').waitFor({state:'visible'})]);
  await Promise.all([s.locator('#verify-match').click(),r.locator('#verify-match').click()]);
  await s.locator('#file').waitFor({state:'attached'});
  for(let i=0;i<80;i++){if(await s.locator('#file').isEnabled())break;await s.waitForTimeout(100);}
  const scdp=await sctx.newCDPSession(s),rcdp=await rctx.newCDPSession(r);
  await scdp.send('Emulation.setCPUThrottlingRate',{rate:4});await rcdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  const sample=path.join(tmp,'Holiday Photos.zip');const size=120*1024*1024;const fh=await import('node:fs/promises');const h=await fh.open(sample,'w');await h.truncate(size);await h.close();
  await move(s,260,330,'Choose file',550);
  await s.locator('#file').setInputFiles(sample);
  await r.locator('#incoming').waitFor({state:'visible'});
  await clickAt(r,'#accept','Save file');
  await Promise.all([s.locator('#transfer-info').waitFor({state:'visible'}),r.locator('#transfer-info').waitFor({state:'visible'})]);
  await move(s,235,465,'Live speed + ETA',650);await move(r,235,465,'Receiving',650);
  await Promise.all([
    s.locator('#notice').filter({hasText:'file verified'}).waitFor({timeout:45000}),
    r.locator('#notice').filter({hasText:'file verified'}).waitFor({timeout:45000})
  ]);
  await move(s,240,560,'SHA-256 verified',650);await move(r,240,560,'Verified',650);
  await s.waitForTimeout(1800);await r.waitForTimeout(1800);
  const [sv,rv]=await Promise.all([closeWithVideo(sctx,s),closeWithVideo(rctx,r)]);
  gifPair(sv,rv,path.join(media,'transfer.gif'));
}

try{
  await staticShots();
  await makePair();
  await pairedSessionWithTransfer();
}finally{
  await browser.close().catch(()=>{});
  server.kill('SIGTERM');
  await new Promise(r=>setTimeout(r,500));
  if(!server.killed)server.kill('SIGKILL');
  await rm(tmp,{recursive:true,force:true});
}

console.log('Captured actual BlinkSend browser media.');
