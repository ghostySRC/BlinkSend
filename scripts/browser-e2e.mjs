import { chromium, firefox, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdtemp, open, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browserName=process.env.BROWSER||'chromium';
const browserType={chromium,firefox,webkit}[browserName];
if(!browserType)throw new Error('Unknown browser: '+browserName);

const port=3189;
const base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:String(port),LOG_LEVEL:'silent'},stdio:'ignore'});

async function waitServer(){
  for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}
  throw new Error('server did not start');
}
async function waitFor(fn,label,timeout=20000){
  const end=Date.now()+timeout;let last;
  while(Date.now()<end){try{if(await fn())return;}catch(e){last=e;}await new Promise(r=>setTimeout(r,100));}
  throw new Error('timeout waiting for '+label+(last?': '+last.message:''));
}
let browser,tempDir;
try{
  await waitServer();
  browser=await browserType.launch({headless:true});
  const senderContext=await browser.newContext({viewport:{width:1000,height:760}});
  const receiverContext=await browser.newContext({viewport:{width:1000,height:760}});
  await receiverContext.addInitScript(() => {
    try { Object.defineProperty(window,'showSaveFilePicker',{value:undefined,configurable:true}); } catch {}
  });
  const sender=await senderContext.newPage(),receiver=await receiverContext.newPage();
  const browserErrors=[];
  for(const [label,page] of [['sender',sender],['receiver',receiver]]){
    page.on('pageerror',error=>browserErrors.push(label+' pageerror: '+error.message));
    page.on('console',msg=>{if(msg.type()==='error')browserErrors.push(label+' console: '+msg.text());});
  }
  await Promise.all([sender.goto(base,{waitUntil:'domcontentloaded'}),receiver.goto(base,{waitUntil:'domcontentloaded'})]);

  await sender.locator('#mode-send').click();
  await waitFor(()=>sender.locator('#pair-code-wrap').isVisible(),'sender pairing code');
  const code=(await sender.locator('#pair-code').textContent()).trim();
  if(!/^[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code))throw new Error('unexpected pairing code');

  await receiver.locator('#mode-receive').click();
  await receiver.locator('#join-code').fill(code);
  await receiver.locator('#join-code-button').click();

  await Promise.all([
    waitFor(()=>sender.locator('#verify-peer').isVisible(),'sender verification'),
    waitFor(()=>receiver.locator('#verify-peer').isVisible(),'receiver verification')
  ]);
  const senderCode=(await sender.locator('#verify-code').textContent()).trim();
  const receiverCode=(await receiver.locator('#verify-code').textContent()).trim();
  if(!/^\d{3} \d{3}$/.test(senderCode)||senderCode!==receiverCode)throw new Error(`verification mismatch: ${senderCode} / ${receiverCode}`);
  if(await sender.locator('#file').isEnabled())throw new Error('send controls unlocked before verification');

  await Promise.all([sender.locator('#verify-match').click(),receiver.locator('#verify-match').click()]);
  await waitFor(()=>sender.locator('#send-text').isEnabled(),'verified send controls',25000);

  const perfMiB=browserName==='chromium'?224:64;
  tempDir=await mkdtemp(join(tmpdir(),'blinksend-e2e-'));
  const perfPath=join(tempDir,'throughput.bin'),fh=await open(perfPath,'w'),block=Buffer.alloc(1024*1024,0x5a);
  try{for(let i=0;i<perfMiB;i++)await fh.write(block);}finally{await fh.close();}
  const perfStart=Date.now();
  await sender.locator('#file').setInputFiles(perfPath);
  await waitFor(()=>receiver.locator('#incoming').isVisible(),'binary transfer prompt',10000);
  await receiver.locator('#accept').click();
  try{await waitFor(()=>sender.locator('#post-transfer').isVisible(),'binary transfer completion',120000);}
  catch(error){
    const state=await Promise.all([sender,receiver].map(async page=>({
      status:await page.locator('#status').textContent().catch(()=>null),
      progress:await page.locator('#progress-text').textContent().catch(()=>null),
      notice:await page.locator('#notice').textContent().catch(()=>null),
      banner:await page.locator('#transfer-state-banner').textContent().catch(()=>null)
    })));
    throw new Error(error.message+' | states='+JSON.stringify(state)+' | browserErrors='+JSON.stringify(browserErrors.slice(-12)));
  }
  const perfSeconds=(Date.now()-perfStart)/1000;
  if(perfSeconds>120)throw new Error(perfMiB+' MiB binary transfer exceeded smoke-test budget');

  // Reuse the verified session for a second file. This catches leaked/terminated
  // hash workers, stale receive workers, and post-transfer state bugs.
  const repeatPath=join(tempDir,'repeat.bin'),repeatHandle=await open(repeatPath,'w'),repeatBlock=Buffer.alloc(1024*1024,0xa5);
  try{for(let i=0;i<16;i++)await repeatHandle.write(repeatBlock);}finally{await repeatHandle.close();}
  await sender.locator('#send-another').click();
  await sender.locator('#file').setInputFiles(repeatPath);
  await waitFor(()=>receiver.locator('#incoming').isVisible(),'second binary transfer prompt',10000);
  await receiver.locator('#accept').click();
  await waitFor(()=>sender.locator('#post-transfer').isVisible(),'second binary transfer completion',30000);

  const message=`BlinkSend ${browserName} WebRTC check ${Date.now()}`;
  await sender.locator('#share-text').fill(message);
  await sender.locator('#send-text').click();
  await waitFor(()=>receiver.locator('#received-text').isVisible(),'received clipboard text',15000);
  const received=(await receiver.locator('#received-content').textContent()).trim();
  if(received!==message)throw new Error('clipboard message mismatch');

  const mobileContext=await browser.newContext({viewport:{width:390,height:844},locale:'es-ES'});
  const mobile=await mobileContext.newPage();await mobile.goto(base,{waitUntil:'domcontentloaded'});
  if(await mobile.locator('#language').inputValue()!=='es')throw new Error('browser locale did not select Spanish');
  if((await mobile.locator('[data-i18n="headline"]').textContent()).trim()!=='Mueve archivos directamente.')throw new Error('Spanish UI pack did not apply');
  const layout=await mobile.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,topbar:(()=>{const r=document.querySelector('.topbar').getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}})(),children:[...document.querySelector('.topbar').children].filter(el=>getComputedStyle(el).display!=='none').map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}})}));
  if(layout.overflow>1)throw new Error('mobile header causes horizontal overflow');
  for(const box of layout.children){if(box.left<layout.topbar.left-1||box.right>layout.topbar.right+1||box.top<layout.topbar.top-1||box.bottom>layout.topbar.bottom+1)throw new Error('mobile header child escapes topbar');}
  await mobileContext.close();

  const fallbackContext=await browser.newContext({locale:'pl-PL'});const fallback=await fallbackContext.newPage();await fallback.goto(base,{waitUntil:'domcontentloaded'});
  if(await fallback.locator('#language').inputValue()!=='en')throw new Error('unsupported browser locale did not fall back to English');await fallbackContext.close();

  const rtlContext=await browser.newContext({locale:'ar-SA'});const rtl=await rtlContext.newPage();await rtl.goto(base,{waitUntil:'domcontentloaded'});
  if(await rtl.locator('#language').inputValue()!=='ar'||await rtl.locator('html').getAttribute('dir')!=='rtl')throw new Error('Arabic locale/RTL did not apply');await rtlContext.close();

  console.log(JSON.stringify({browser:browserName,pairingCode:true,verificationCode:true,webrtcText:true,binaryFile:true,binaryMiB:perfMiB,binaryMiBPerSec:Number((perfMiB/perfSeconds).toFixed(2)),sessionReuseFile:true,mobileLayout:true,browserLocale:true,rtl:true},null,2));
  await Promise.all([senderContext.close(),receiverContext.close()]);
}finally{
  await browser?.close().catch(()=>{});
  if(tempDir)await rm(tempDir,{recursive:true,force:true}).catch(()=>{});
  server.kill('SIGTERM');
  await new Promise(r=>setTimeout(r,250));
  if(!server.killed)server.kill('SIGKILL');
}
