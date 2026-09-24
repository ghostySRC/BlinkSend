(() => {
  const DB_NAME = 'blinksend';
  const STORE = 'sessions';
  let dbPromise;
  function db() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const database = req.result;
        if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }
  async function tx(mode, fn) {
    const database = await db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, mode);
      const store = transaction.objectStore(STORE);
      let result;
      try { result = fn(store); } catch (error) { reject(error); return; }
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Transaction aborted'));
    });
  }
  async function put(value) {
    const copy = { ...value, updatedAt: Date.now() };
    await tx('readwrite', store => store.put(copy));
    return copy;
  }
  async function get(id) {
    const database = await db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
  async function remove(id) { await tx('readwrite', store => store.delete(id)); }
  async function findRoom(room) {
    const database = await db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).getAll();
      request.onsuccess = () => resolve((request.result || []).filter(x => x.room === room).sort((a,b) => b.updatedAt - a.updatedAt));
      request.onerror = () => reject(request.error);
    });
  }
  window.BlinkStore = { put, get, remove, findRoom };
})();