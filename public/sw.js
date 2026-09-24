const CACHE='blinksend-shell-v2';
const SHELL=['/','/style.css','/app.js','/locales.js','/locales/es.js','/locales/fr.js','/locales/de.js','/locales/pt.js','/locales/zh.js','/locales/ja.js','/locales/ar.js','/sha256.js','/protocol.js','/security.js','/verification.js','/connection.js','/control-policy.js','/transfer-core.js','/storage.js','/persistence.js','/favicon.svg','/manifest.webmanifest'];
const SHELL_PATHS=new Set(SHELL);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()
])));
function shareDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open('blinksend-share',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('inbox'))req.result.createObjectStore('inbox',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function storeShare(request){
  const form=await request.formData(),files=form.getAll('files').filter(v=>v instanceof File),title=String(form.get('title')||''),text=String(form.get('text')||''),url=String(form.get('url')||'');
  const db=await shareDb();await new Promise((resolve,reject)=>{const tx=db.transaction('inbox','readwrite'),store=tx.objectStore('inbox');store.put({id:'pending',title,text,url,files,createdAt:Date.now()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  return Response.redirect('/?share=1',303);
}
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin===location.origin&&url.pathname==='/share-target'&&event.request.method==='POST'){event.respondWith(storeShare(event.request));return;}
  if(event.request.method!=='GET'||url.origin!==location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('/',copy));return r;}).catch(()=>caches.match('/')));
    return;
  }
  if(!SHELL_PATHS.has(url.pathname)){return;}
  event.respondWith(fetch(event.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(event.request,r.clone()));return r;}).catch(()=>caches.match(event.request)));
});
