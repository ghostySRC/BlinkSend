import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, rm, open } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const media=path.join(root,'docs','media');
const tmp=path.join(root,'.readme-capture');
await rm(tmp,{recursive:true,force:true});
await mkdir(tmp,{recursive:true});
await mkdir(media,{recursive:true});

const port=3127;
const base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port),LOG_LEVEL:'silent'},stdio:'ignore'});

async function waitForServer(){
  for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}
  throw new Error('BlinkSend server did not become ready');
}
await waitForServer();
const browser=await chromium.launch({headless:true});

function ff(args){
  const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
  if(r.status!==0)throw new Error('ffmpeg failed: '+args.join(' '));
}
function toWebp(input,output,width){
  ff(['-i',input,'-vf',`scale=${width}:-2:flags=lanczos`,'-c:v','libwebp','-quality','90',output]);
}
function gifPair(a,b,output){
  const filter=[
    '[0:v]minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=480:540:force_original_aspect_ratio=decrease,pad=480:540:(ow-iw)/2:(oh-ih)/2:#f6f7f8[a]',
    '[1:v]minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=480:540:force_original_aspect_ratio=decrease,pad=480:540:(ow-iw)/2:(oh-ih)/2:#f6f7f8[b]',
    '[a][b]hstack=inputs=2,fps=30,split[s0][s1]',
    '[s0]palettegen=max_colors=224:stats_mode=diff[p]',
    '[s1][p]paletteuse=dither=bayer:bayer_scale=2[out]'
  ].join(';');
  ff(['-i',a,'-i',b,'-filter_complex',filter,'-map','[out]','-shortest','-loop','0',output]);
}
function gifSingle(input,output){
  const filter='[0:v]minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=960:-2:flags=lanczos,fps=30,split[s0][s1];[s0]palettegen=max_colors=224:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=2[out]';
  ff(['-i',input,'-filter_complex',filter,'-map','[out]','-loop','0',output]);
}

async function overlay(page){
  await page.evaluate(()=>{
    const style=document.createElement('style');
    style.textContent=`
      #doc-cursor{position:fixed;left:0;top:0;z-index:2147483647;width:72px;height:84px;pointer-events:none;transform:translate3d(64px,78px,0);transition:transform .72s cubic-bezier(.16,1,.3,1),filter .13s,scale .1s;filter:drop-shadow(0 4px 3px #0008);scale:1}
      #doc-cursor::before{content:"";position:absolute;left:-15px;top:-15px;width:70px;height:70px;border:3px solid #3dc29c;border-radius:50%;opacity:.32}
      #doc-cursor.down{scale:.86;filter:drop-shadow(0 1px 1px #0008)}
      #doc-cursor svg{width:72px;height:84px;display:block}
      #doc-label{position:fixed;z-index:2147483646;left:0;top:0;pointer-events:none;background:#155f4e;color:white;border:2px solid #8be5c6;border-radius:999px;padding:9px 14px;font:800 15px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;opacity:0;transform:translate3d(105px,62px,0);transition:transform .72s cubic-bezier(.16,1,.3,1),opacity .16s;box-shadow:0 5px 18px #0003}
      .doc-ripple{position:fixed;z-index:2147483645;width:26px;height:26px;margin:-13px 0 0 -13px;border:6px solid #3dc29c;border-radius:50%;pointer-events:none;animation:docRipple .55s ease-out forwards}
      @keyframes docRipple{to{width:104px;height:104px;margin:-52px 0 0 -52px;opacity:0}}
    `;
    document.head.append(style);
    const c=document.createElement('div');c.id='doc-cursor';
    c.innerHTML='<svg viewBox="0 0 72 84" xmlns="http://www.w3.org/2000/svg"><path d="M7 5 L13 63 L27 47 L44 76 L58 68 L41 40 L65 35 Z" fill="white" stroke="#0a1114" stroke-width="5" stroke-linejoin="round"/></svg>';
    const l=document.createElement('div');l.id='doc-label';document.body.append(c,l);
  });
}
async function move(page,x,y,label='',ms=720,hold=360){
  await page.evaluate(({x,y,label,ms})=>{
    const c=document.querySelector('#doc-cursor'),l=document.querySelector('#doc-label');
    c.style.transitionDuration=ms+'ms';l.style.transitionDuration=ms+'ms';
    c.style.transform=`translate3d(${x}px,${y}px,0)`;
    l.textContent=label;l.style.opacity=label?'1':'0';
    l.style.transform=`translate3d(${Math.min(innerWidth-235,x+70)}px,${Math.max(12,y-25)}px,0)`;
  },{x,y,label,ms});
  await page.waitForTimeout(ms+hold);
}
async function clickAt(page,selector,label){
  const el=page.locator(selector);const box=await el.boundingBox();if(!box)throw new Error('No box for '+selector);
  const x=Math.round(box.x+box.width/2),y=Math.round(box.y+box.height/2);
  await move(page,x,y,label,720,420);
  await page.evaluate(({x,y})=>{
    const c=document.querySelector('#doc-cursor');c.classList.add('down');
    const r=document.createElement('div');r.className='doc-ripple';r.style.left=x+'px';r.style.top=y+'px';document.body.append(r);
    setTimeout(()=>c.classList.remove('down'),140);setTimeout(()=>r.remove(),650);
  },{x,y});
  await page.waitForTimeout(150);await el.click();await page.waitForTimeout(520);
}
async function typeAt(page,selector,value,label){
  const el=page.locator(selector);const box=await el.boundingBox();if(!box)throw new Error('No box for '+selector);
  await move(page,Math.round(box.x+box.width*.3),Math.round(box.y+box.height/2),label,650,350);
  await el.click();await el.fill('');await el.pressSequentially(value,{delay:85});await page.waitForTimeout(420);
}
async function closeVideo(ctx,page){const v=page.video();await ctx.close();return v?await v.path():null;}
async function makeSparseFile(name,bytes){const p=path.join(tmp,name),h=await open(p,'w');await h.truncate(bytes);await h.close();return p;}

async function pair(s,r,withOverlay=true){
  if(withOverlay)await Promise.all([overlay(s),overlay(r)]);
  await clickAt(s,'#mode-send','Send');
  await s.locator('#pair-code-wrap').waitFor({state:'visible'});
  const code=(await s.locator('#pair-code').textContent()).trim();
  await clickAt(r,'#mode-receive','Receive');
  await typeAt(r,'#join-code',code,'Type pairing code');
  await clickAt(r,'#join-code-button','Use code');
  await Promise.all([s.locator('#verify-peer').waitFor({state:'visible'}),r.locator('#verify-peer').waitFor({state:'visible'})]);
  await move(s,170,410,'Compare this code',720,500);await move(r,170,410,'Same code',720,500);
  await clickAt(s,'#verify-match','Codes match');await clickAt(r,'#verify-match','Codes match');
  for(let i=0;i<100;i++){if(await s.locator('#file').isEnabled())return;await s.waitForTimeout(100);}
  throw new Error('pair did not become ready');
}

async function staticShots(){
  const desktopPng=path.join(tmp,'desktop.png');
  const ctx=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:2});
  const p=await ctx.newPage();await p.goto(base,{waitUntil:'networkidle'});await p.locator('#mode-send').click();await p.locator('#pair-code-wrap').waitFor({state:'visible'});await p.screenshot({path:desktopPng,type:'png'});await ctx.close();toWebp(desktopPng,path.join(media,'desktop.webp'),1440);

  const lightPng=path.join(tmp,'mobile.png'),darkPng=path.join(tmp,'mobile-dark.png');
  const mctx=await browser.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,isMobile:true});
  const m=await mctx.newPage();await m.goto(base,{waitUntil:'networkidle'});await m.locator('#mode-receive').click();await m.screenshot({path:lightPng,type:'png'});
  await m.goto(base,{waitUntil:'networkidle'});await m.locator('#theme-toggle').click();await m.locator('#mode-send').click();await m.locator('#pair-code-wrap').waitFor({state:'visible'});await m.screenshot({path:darkPng,type:'png'});await mctx.close();
  toWebp(lightPng,path.join(media,'mobile.webp'),860);toWebp(darkPng,path.join(media,'mobile-dark.webp'),860);
}

async function makePairGif(){
  const opts={viewport:{width:720,height:800},recordVideo:{dir:tmp,size:{width:720,height:800}}};
  const sctx=await browser.newContext(opts),rctx=await browser.newContext(opts),s=await sctx.newPage(),r=await rctx.newPage();
  await Promise.all([s.goto(base,{waitUntil:'networkidle'}),r.goto(base,{waitUntil:'networkidle'})]);await pair(s,r,true);await Promise.all([s.waitForTimeout(1500),r.waitForTimeout(1500)]);
  const [sv,rv]=await Promise.all([closeVideo(sctx,s),closeVideo(rctx,r)]);gifPair(sv,rv,path.join(media,'pairing.gif'));
}

async function makeTransferGif(){
  const opts={viewport:{width:720,height:800},recordVideo:{dir:tmp,size:{width:720,height:800}}};
  const init=()=>{try{Object.defineProperty(window,'showSaveFilePicker',{value:undefined,configurable:true});Object.defineProperty(navigator.storage,'getDirectory',{value:undefined,configurable:true});}catch{}};
  const sctx=await browser.newContext(opts),rctx=await browser.newContext(opts);await sctx.addInitScript(init);await rctx.addInitScript(init);
  const s=await sctx.newPage(),r=await rctx.newPage();await Promise.all([s.goto(base,{waitUntil:'networkidle'}),r.goto(base,{waitUntil:'networkidle'})]);await pair(s,r,true);
  const file=await makeSparseFile('Holiday Photos.zip',96*1024*1024);
  const box=await s.locator('#drop').boundingBox();await move(s,Math.round(box.x+box.width/2),Math.round(box.y+box.height/2),'Choose file',650,420);await s.locator('#file').setInputFiles(file);
  await r.locator('#incoming').waitFor({state:'visible'});await clickAt(r,'#accept','Save file');
  await Promise.all([s.locator('#transfer-info').waitFor({state:'visible'}),r.locator('#transfer-info').waitFor({state:'visible'})]);
  await move(s,245,560,'Live speed + ETA',700,600);await move(r,245,560,'Receiving',700,600);
  await Promise.all([s.locator('#notice').filter({hasText:'file verified'}).waitFor({timeout:45000}),r.locator('#notice').filter({hasText:'file verified'}).waitFor({timeout:45000})]);
  await move(s,330,675,'Verified',650,700);
  if(await s.locator('#send-another').isVisible())await clickAt(s,'#send-another','Send another');
  await Promise.all([s.waitForTimeout(1200),r.waitForTimeout(1200)]);
  const [sv,rv]=await Promise.all([closeVideo(sctx,s),closeVideo(rctx,r)]);gifPair(sv,rv,path.join(media,'transfer.gif'));
}

async function makeQueueGif(){
  const opts={viewport:{width:960,height:760},recordVideo:{dir:tmp,size:{width:960,height:760}}};
  const init=()=>{try{Object.defineProperty(window,'showSaveFilePicker',{value:undefined,configurable:true});Object.defineProperty(navigator.storage,'getDirectory',{value:undefined,configurable:true});}catch{}};
  const sctx=await browser.newContext(opts),rctx=await browser.newContext({viewport:{width:720,height:800}});await sctx.addInitScript(init);await rctx.addInitScript(init);
  const s=await sctx.newPage(),r=await rctx.newPage();await Promise.all([s.goto(base,{waitUntil:'networkidle'}),r.goto(base,{waitUntil:'networkidle'})]);await pair(s,r,true);
  const files=[await makeSparseFile('01-intro.mov',18*1024*1024),await makeSparseFile('02-assets.zip',12*1024*1024),await makeSparseFile('03-notes.pdf',6*1024*1024)];
  await s.locator('#file').setInputFiles(files);
  await s.locator('#queue-panel').waitFor({state:'visible'});
  const secondDown=s.locator('#queue-list .queue-item').nth(0).locator('button').nth(1);const b=await secondDown.boundingBox();if(b){await move(s,Math.round(b.x+b.width/2),Math.round(b.y+b.height/2),'Reorder pending files',650,450);await secondDown.click();await s.waitForTimeout(500);}
  const remove=s.locator('#queue-list .queue-item').nth(1).locator('button').nth(2);const rb=await remove.boundingBox();if(rb){await move(s,Math.round(rb.x+rb.width/2),Math.round(rb.y+rb.height/2),'Remove from queue',650,450);await remove.click();await s.waitForTimeout(600);}
  for(let i=0;i<2;i++){await r.locator('#incoming').waitFor({state:'visible'});await r.locator('#accept').click();await r.locator('#incoming').waitFor({state:'hidden'});await s.waitForTimeout(700);}
  await s.locator('#post-transfer').waitFor({state:'visible',timeout:45000});await clickAt(s,'#send-another','Keep the session');
  await s.waitForTimeout(1200);const sv=await closeVideo(sctx,s);await rctx.close();gifSingle(sv,path.join(media,'queue.gif'));
}

try{await staticShots();await makePairGif();await makeTransferGif();await makeQueueGif();}
finally{await browser.close().catch(()=>{});server.kill('SIGTERM');await new Promise(r=>setTimeout(r,500));if(!server.killed)server.kill('SIGKILL');await rm(tmp,{recursive:true,force:true});}
console.log('Captured high-resolution BlinkSend browser media.');
