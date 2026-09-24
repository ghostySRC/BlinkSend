import { chromium, firefox, webkit } from 'playwright';
import { spawn } from 'node:child_process';

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
let browser;
try{
  await waitServer();
  browser=await browserType.launch({headless:true});
  const senderContext=await browser.newContext({viewport:{width:1000,height:760}});
  const receiverContext=await browser.newContext({viewport:{width:1000,height:760}});
  const sender=await senderContext.newPage(),receiver=await receiverContext.newPage();
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

  const message=`BlinkSend ${browserName} WebRTC check ${Date.now()}`;
  await sender.locator('#share-text').fill(message);
  await sender.locator('#send-text').click();
  await waitFor(()=>receiver.locator('#received-text').isVisible(),'received clipboard text',15000);
  const received=(await receiver.locator('#received-content').textContent()).trim();
  if(received!==message)throw new Error('clipboard message mismatch');

  console.log(JSON.stringify({browser:browserName,pairingCode:true,verificationCode:true,webrtcText:true},null,2));
  await Promise.all([senderContext.close(),receiverContext.close()]);
}finally{
  await browser?.close().catch(()=>{});
  server.kill('SIGTERM');
  await new Promise(r=>setTimeout(r,250));
  if(!server.killed)server.kill('SIGKILL');
}
