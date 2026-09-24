(() => {
  const DB_NAME='blinksend', SESSION_STORE='sessions', HISTORY_STORE='history';
  let dbPromise;
  function db(){
    if(!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if(!dbPromise) dbPromise=new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,2);
      req.onupgradeneeded=()=>{
        const database=req.result;
        if(!database.objectStoreNames.contains(SESSION_STORE)) database.createObjectStore(SESSION_STORE,{keyPath:'id'});
        if(!database.objectStoreNames.contains(HISTORY_STORE)) database.createObjectStore(HISTORY_STORE,{keyPath:'id'});
      };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
    return dbPromise;
  }
  async function request(storeName,mode,work){
    const database=await db();
    return new Promise((resolve,reject)=>{
      const tx=database.transaction(storeName,mode), store=tx.objectStore(storeName);
      let req; try{req=work(store);}catch(error){reject(error);return;}
      if(req && 'onsuccess' in req){req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);}
      else {tx.oncomplete=()=>resolve(req);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Transaction aborted'));}
    });
  }
  async function put(value){const copy={...value,updatedAt:Date.now()};await request(SESSION_STORE,'readwrite',s=>s.put(copy));return copy;}
  const get=id=>request(SESSION_STORE,'readonly',s=>s.get(id)).then(x=>x||null);
  const remove=id=>request(SESSION_STORE,'readwrite',s=>s.delete(id));
  async function findRoom(room){const all=await request(SESSION_STORE,'readonly',s=>s.getAll());return (all||[]).filter(x=>x.room===room).sort((a,b)=>b.updatedAt-a.updatedAt);}
  async function addHistory(value){
    const item={id:crypto.randomUUID(),createdAt:Date.now(),...value}; await request(HISTORY_STORE,'readwrite',s=>s.put(item));
    const all=await listHistory(200); for(const old of all.slice(100)) await request(HISTORY_STORE,'readwrite',s=>s.delete(old.id));
    return item;
  }
  async function listHistory(limit=30){const all=await request(HISTORY_STORE,'readonly',s=>s.getAll());return (all||[]).sort((a,b)=>b.createdAt-a.createdAt).slice(0,limit);}
  const clearHistory=()=>request(HISTORY_STORE,'readwrite',s=>s.clear());
  window.BlinkStore={put,get,remove,findRoom,addHistory,listHistory,clearHistory};
})();