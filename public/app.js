(() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['qr','copy','new-room','status','status-dot','file','folder','choose-folder','share-text','send-text','received-text','received-link','copy-received','drop','transfer-info','file-name','file-size','progress','progress-text','cancel','queue-status','notice','incoming','incoming-detail','save-note','accept','decline'].map(id => [id, $(id)]));
  const translations = {
  "en": {
    "language": "Language",
    "workspace": "File transfer",
    "sendFiles": "Send files",
    "intro": "Connect another device to send or receive files.",
    "connectDevice": "Connect a device",
    "scan": "Scan the code or open the invite link on your other device.",
    "qrAlt": "QR code for this room",
    "copy": "Copy invite link",
    "copied": "Link copied",
    "newRoom": "New room",
    "private": "Anyone with the link can join this room. Share it privately.",
    "files": "Files",
    "direction": "Send files in either direction once connected.",
    "chooseFiles": "Choose files",
    "chooseFolder": "Choose folder",
    "linkPlaceholder": "Paste a link",
    "sendLink": "Send link",
    "receivedLink": "Received link",
    "copyLink": "Copy link",
    "linkSent": "Link sent.",
    "invalidLink": "Enter a valid http:// or https:// link.",
    "dropHere": "or drop them here on a computer",
    "transferProgress": "Transfer progress",
    "cancel": "Cancel",
    "cancelBatch": "Cancel batch",
    "keepOpen": "Keep both tabs open until the transfer finishes.",
    "footer": "BlinkSend · Two devices per room",
    "incomingFile": "Incoming file",
    "decline": "Decline",
    "saveFile": "Save file",
    "ready": "Connected — ready to send",
    "readyRelay": "Connected via relay — ready to send",
    "readyDirect": "Connected directly — ready to send",
    "connectingRoom": "Connecting to room…",
    "waiting": "Waiting for another device…",
    "connectFailed": "Could not connect devices",
    "turnHelp": "Check that both tabs are open, then refresh them. Some networks require a TURN relay.",
    "interrupted": "Connection interrupted. Try refreshing both devices.",
    "peerLeft": "Other device disconnected",
    "transferFailed": "Transfer failed. Please try again.",
    "roomFull": "Room full",
    "roomFullHelp": "Only two devices can join a room. Create a new room to start over.",
    "connecting": "Connecting devices…",
    "directFailed": "Could not establish a direct connection. Refresh both devices and try again.",
    "expired": "Room expired — reconnecting…",
    "reconnecting": "Reconnecting to room…",
    "starting": "Starting…",
    "queue": "File %current% of %total% · %remaining% remaining",
    "sending": "Sending",
    "receiving": "Receiving",
    "speed": "%label% %bytes% of %total% · %speed%/s",
    "connectionLost": "Connection lost. Transfer stopped.",
    "waitingAcceptance": "Waiting for acceptance…",
    "finishing": "Finishing on other device…",
    "declined": "Other device declined the file.",
    "peerCancelled": "Transfer cancelled by other device.",
    "incomplete": "Transfer incomplete. Please try again.",
    "received": "File received successfully.",
    "saveFailed": "Could not save file. Please try again.",
    "sentBatch": "File %current% of %total% sent successfully.",
    "sent": "File sent successfully.",
    "excess": "Received more data than expected. Transfer stopped.",
    "writeFailed": "Could not write file. Please try again.",
    "largeUnsupported": "This browser cannot stream large downloads to disk. Use a desktop Chrome browser to receive this file.",
    "saveNote": "Choose where to save it if your browser supports that option.",
    "incomingPrompt": "Incoming file — choose whether to accept",
    "saveLocationFailed": "Could not open a location to save the file.",
    "cancelled": "Transfer cancelled.",
    "copyFailed": "Could not copy the link. Copy it from your browser address bar.",
    "finishFirst": "Finish or cancel the current transfer first.",
    "switchDark": "Switch to dark mode",
    "switchLight": "Switch to light mode",
    "dark": "Dark",
    "light": "Light"
  },
  "sv": {
    "language": "Språk",
    "workspace": "Filöverföring",
    "sendFiles": "Skicka filer",
    "intro": "Anslut en annan enhet för att skicka eller ta emot filer.",
    "connectDevice": "Anslut en enhet",
    "scan": "Skanna koden eller öppna inbjudningslänken på din andra enhet.",
    "qrAlt": "QR-kod för det här rummet",
    "copy": "Kopiera inbjudningslänk",
    "copied": "Länken kopierad",
    "newRoom": "Nytt rum",
    "private": "Alla med länken kan ansluta till rummet. Dela den privat.",
    "files": "Filer",
    "direction": "Skicka filer åt båda hållen när enheterna är anslutna.",
    "chooseFiles": "Välj filer",
    "chooseFolder": "Välj mapp",
    "linkPlaceholder": "Klistra in en länk",
    "sendLink": "Skicka länk",
    "receivedLink": "Mottagen länk",
    "copyLink": "Kopiera länk",
    "linkSent": "Länken skickades.",
    "invalidLink": "Ange en giltig http://- eller https://-länk.",
    "dropHere": "eller dra dem hit på en dator",
    "transferProgress": "Överföringsförlopp",
    "cancel": "Avbryt",
    "cancelBatch": "Avbryt alla",
    "keepOpen": "Håll båda flikarna öppna tills överföringen är klar.",
    "footer": "BlinkSend · Två enheter per rum",
    "incomingFile": "Inkommande fil",
    "decline": "Neka",
    "saveFile": "Spara fil",
    "ready": "Ansluten — redo att skicka",
    "readyRelay": "Ansluten via relä — redo att skicka",
    "readyDirect": "Direktansluten — redo att skicka",
    "connectingRoom": "Ansluter till rummet…",
    "waiting": "Väntar på en annan enhet…",
    "connectFailed": "Kunde inte ansluta enheterna",
    "turnHelp": "Kontrollera att båda flikarna är öppna och uppdatera dem. Vissa nätverk kräver ett TURN-relä.",
    "interrupted": "Anslutningen bröts. Försök uppdatera båda enheterna.",
    "peerLeft": "Den andra enheten kopplades från",
    "transferFailed": "Överföringen misslyckades. Försök igen.",
    "roomFull": "Rummet är fullt",
    "roomFullHelp": "Bara två enheter kan ansluta till ett rum. Skapa ett nytt rum för att börja om.",
    "connecting": "Ansluter enheterna…",
    "directFailed": "Kunde inte upprätta anslutningen. Uppdatera båda enheterna och försök igen.",
    "expired": "Rummet har löpt ut — ansluter igen…",
    "reconnecting": "Återansluter till rummet…",
    "starting": "Startar…",
    "queue": "Fil %current% av %total% · %remaining% återstår",
    "sending": "Skickar",
    "receiving": "Tar emot",
    "speed": "%label% %bytes% av %total% · %speed%/s",
    "connectionLost": "Anslutningen bröts. Överföringen stoppades.",
    "waitingAcceptance": "Väntar på godkännande…",
    "finishing": "Slutför på den andra enheten…",
    "declined": "Den andra enheten nekade filen.",
    "peerCancelled": "Överföringen avbröts av den andra enheten.",
    "incomplete": "Överföringen är ofullständig. Försök igen.",
    "received": "Filen har tagits emot.",
    "saveFailed": "Kunde inte spara filen. Försök igen.",
    "sentBatch": "Fil %current% av %total% har skickats.",
    "sent": "Filen har skickats.",
    "excess": "Mer data än väntat togs emot. Överföringen stoppades.",
    "writeFailed": "Kunde inte skriva filen. Försök igen.",
    "largeUnsupported": "Den här webbläsaren kan inte strömma stora nedladdningar till disken. Använd Chrome på en dator för att ta emot filen.",
    "saveNote": "Välj var filen ska sparas om din webbläsare stöder det.",
    "incomingPrompt": "Inkommande fil — välj om du vill ta emot den",
    "saveLocationFailed": "Kunde inte öppna en plats för att spara filen.",
    "cancelled": "Överföringen avbröts.",
    "copyFailed": "Kunde inte kopiera länken. Kopiera den från webbläsarens adressfält.",
    "finishFirst": "Slutför eller avbryt den pågående överföringen först.",
    "switchDark": "Växla till mörkt läge",
    "switchLight": "Växla till ljust läge",
    "dark": "Mörkt",
    "light": "Ljust"
  }
};
  const readSetting = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const saveSetting = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing may disable storage. */ } };
  let language = readSetting('blinksend-language') || (navigator.language?.toLowerCase().startsWith('sv') ? 'sv' : 'en');
  if (!translations[language]) language = 'en';
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let theme = readSetting('blinksend-theme') || (systemTheme.matches ? 'dark' : 'light');
  if (!['dark', 'light'].includes(theme)) theme = 'light';
  const tr = (key, vars = {}) => (translations[language][key] || translations.en[key] || key).replace(/%([a-z]+)%/g, (_, name) => String(vars[name] ?? ''));
  let lastStatus = { key: 'connectingRoom', ready: false, vars: {} }, lastNotice = { key: '', vars: {} }, progressState, copyTimer;
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#171d20' : '#f6f7f8';
    const toggle = $('theme-toggle');
    toggle.textContent = tr(theme === 'dark' ? 'light' : 'dark');
    toggle.title = toggle.ariaLabel = tr(theme === 'dark' ? 'switchLight' : 'switchDark');
  }
  function applyLanguage() {
    document.documentElement.lang = language;
    document.title = language === 'sv' ? 'BlinkSend — Filöverföring' : 'BlinkSend — File transfer';
    $('language').value = language;
    $('language').ariaLabel = tr('language');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = tr(el.dataset.i18nAlt); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.ariaLabel = tr(el.dataset.i18nAria); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = tr(el.dataset.i18nPlaceholder); });
    els.status.textContent = tr(lastStatus.key, lastStatus.vars);
    els.notice.textContent = lastNotice.key ? tr(lastNotice.key, lastNotice.vars) : '';
    if (pending) updateSaveNote();
    if (active) renderTransfer();
    if (els.copy.dataset.copied) els.copy.textContent = tr('copied');
    applyTheme();
  }
  $('language').onchange = e => { language = e.target.value; saveSetting('blinksend-language', language); applyLanguage(); };
  $('theme-toggle').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; saveSetting('blinksend-theme', theme); applyTheme(); };
  systemTheme.addEventListener?.('change', e => { if (!readSetting('blinksend-theme')) { theme = e.matches ? 'dark' : 'light'; applyTheme(); } });
  function updateSaveNote() {
    els['save-note'].textContent = tr(!window.showSaveFilePicker && !supportsOpfs && pending.size > maxMemoryFile ? 'largeUnsupported' : 'saveNote');
  }
  function renderTransfer() {
    els['queue-status'].textContent = tr('queue', { current: batchDone + 1, total: batchTotal, remaining: outgoing.length });
    els.cancel.textContent = tr(batchTotal > 1 && active?.direction === 'send' ? 'cancelBatch' : 'cancel');
    if (progressState) {
      const { bytes, total, started, label } = progressState;
      const speed = bytes / Math.max(1, (Date.now() - started) / 1000);
      els['progress-text'].textContent = tr('speed', { label: tr(label), bytes: format(bytes), total: format(total), speed: format(speed) });
    } else els['progress-text'].textContent = tr(active?.stage || 'starting');
  }
  const chunkSize = 64 * 1024;
  const maxMemoryFile = 200 * 1024 * 1024;
  const supportsOpfs = !!navigator.storage?.getDirectory;
  const format = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;
  let socket, pc, channel, pending, active, incomingQueue = Promise.resolve(), signalQueue = Promise.resolve(), connectTimer;
  let readyLabel = 'ready';
  let outgoing = [], batchTotal = 0, batchDone = 0;
  let room = location.hash.slice(1).toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(room)) { room = [...crypto.getRandomValues(new Uint8Array(16))].map(v => v.toString(16).padStart(2,'0')).join(''); history.replaceState(null, '', `${location.pathname}${location.search}#${room}`); }
  const roomLink = () => `${location.origin}${location.pathname}#${room}`;
  els.qr.src = `/qr?url=${encodeURIComponent(roomLink())}`;
  function status(key, ready = false, vars = {}) {
    lastStatus = { key, ready, vars };
    els.status.textContent = tr(key, vars);
    els['status-dot'].classList.toggle('ready', ready);
    els.file.disabled = !ready || !!active || !!pending;
    els.folder.disabled = els.file.disabled;
    els['choose-folder'].disabled = els.file.disabled;
    els['share-text'].disabled = !ready;
    els['send-text'].disabled = !ready;
    els.drop.classList.toggle('disabled', els.file.disabled);
  }
  function notice(key = '', vars = {}) { lastNotice = { key, vars }; els.notice.textContent = key ? tr(key, vars) : ''; }
  function signal(type, payload) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload })); }
  function resetPeer() {
    clearTimeout(connectTimer);
    if (active) stopTransfer('connectionLost', false);
    pending = null; els.incoming.hidden = true;
    channel?.close(); pc?.close(); channel = null; pc = null;
    status('waiting');
  }
  async function connectionPath() {
    const current = pc;
    try {
      const stats = await current.getStats();
      if (pc !== current || channel?.readyState !== 'open') return;
      let pair;
      for (const item of stats.values()) {
        if (item.type === 'transport' && item.selectedCandidatePairId) pair = stats.get(item.selectedCandidatePairId);
        if (!pair && item.type === 'candidate-pair' && item.nominated && item.state === 'succeeded') pair = item;
      }
      const local = stats.get(pair?.localCandidateId), remote = stats.get(pair?.remoteCandidateId);
      const relayed = local?.candidateType === 'relay' || remote?.candidateType === 'relay';
      readyLabel = !pair ? 'ready' : relayed ? 'readyRelay' : 'readyDirect';
      status(readyLabel, true);
    } catch { if (pc === current && channel?.readyState === 'open') status(readyLabel, true); }
  }
  async function makePeer() {
    pc?.close();
    clearTimeout(connectTimer);
    let iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    try { const response = await fetch('/ice', { signal: AbortSignal.timeout(5000) }); if (response.ok) iceServers = (await response.json()).iceServers; } catch { /* Default STUN is sufficient for many networks. */ }
    pc = new RTCPeerConnection({ iceServers });
    const current = pc;
    connectTimer = setTimeout(() => {
      if (pc === current && channel?.readyState !== 'open') {
        status('connectFailed');
        notice('turnHelp');
      }
    }, 20_000);
    pc.onicecandidate = e => { if (e.candidate) signal('candidate', e.candidate.toJSON()); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected' && channel?.readyState === 'open') connectionPath();
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { if (active) stopTransfer('connectionLost', false); status('interrupted'); }
    };
    pc.ondatachannel = e => setupChannel(e.channel);
  }
  function setupChannel(ch) {
    channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.bufferedAmountLowThreshold = 2 * 1024 * 1024;
    ch.onopen = () => { clearTimeout(connectTimer); connectionPath(); notice(); };
    ch.onclose = () => { if (active) stopTransfer('connectionLost', false); status('peerLeft'); };
    ch.onmessage = e => {
      incomingQueue = incomingQueue.then(() => typeof e.data === 'string' ? control(e.data) : receiveChunk(e.data)).catch(() => {
        if (active) stopTransfer('transferFailed');
      });
    };
  }
  function connect() {
    socket = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/signal`);
    socket.onopen = () => socket.send(JSON.stringify({ type: 'join', room }));
    socket.onmessage = e => { signalQueue = signalQueue.then(async () => {
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      try {
        if (msg.type === 'joined') status(msg.count === 1 ? 'waiting' : 'connecting');
        if (msg.type === 'full') { status('roomFull'); notice('roomFullHelp'); }
        if (msg.type === 'peer-left') resetPeer();
        if (msg.type === 'peer-joined') { await makePeer(); setupChannel(pc.createDataChannel('files', { ordered: true })); await pc.setLocalDescription(await pc.createOffer()); signal('offer', pc.localDescription.toJSON()); status('connecting'); }
        if (msg.type === 'offer') { await makePeer(); await pc.setRemoteDescription(msg.payload); await pc.setLocalDescription(await pc.createAnswer()); signal('answer', pc.localDescription.toJSON()); status('connecting'); }
        if (msg.type === 'answer' && pc) await pc.setRemoteDescription(msg.payload);
        if (msg.type === 'candidate' && pc) await pc.addIceCandidate(msg.payload);
      } catch { notice('directFailed'); }
    }).catch(() => notice('directFailed')); };
    socket.onclose = e => {
      if (e.code === 1008) return;
      resetPeer(); setTimeout(connect, 2000);
      status(e.code === 1001 ? 'expired' : 'reconnecting');
    };
  }
  function showTransfer(name, size) {
    els['transfer-info'].hidden = false; els['file-name'].textContent = name; els['file-size'].textContent = format(size);
    els.progress.value = 0; active.stage = 'starting'; progressState = null;
    els.file.disabled = true; els.drop.classList.add('disabled');
    els['queue-status'].hidden = batchTotal < 2 || active?.direction !== 'send';
    renderTransfer();
  }
  function progress(bytes, total, started, label) {
    els.progress.value = total ? Math.min(100, bytes / total * 100) : 100;
    progressState = { bytes, total, started, label };
    renderTransfer();
  }
  function stopTransfer(message, notify = true, preserveQueue = false, vars = {}) {
    if (notify && active && channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'cancel', id: active.id }));
    if (active?.writer) active.writer.abort().catch(() => {});
    if (active?.opfs) active.opfs.root.removeEntry(active.opfs.tempName).catch(() => {});
    active = null; progressState = null;
    if (!preserveQueue) { outgoing = []; batchTotal = 0; batchDone = 0; }
    els['transfer-info'].hidden = true; els.file.value = '';
    status(channel?.readyState === 'open' ? readyLabel : 'waiting', channel?.readyState === 'open');
    notice(message, vars);
  }
  async function sendFile(entry) {
    if (!entry || channel?.readyState !== 'open' || active || pending) return;
    const file = entry.file || entry;
    const relativePath = entry.relativePath || file.webkitRelativePath || '';
    const id = crypto.randomUUID(); active = { id, direction: 'send', file, relativePath, sent: 0, started: Date.now(), accepted: false };
    showTransfer(relativePath || file.name, file.size);
    channel.send(JSON.stringify({ type: 'request', id, name: file.name, relativePath, size: file.size }));
    active.stage = 'waitingAcceptance'; renderTransfer();
  }
  function sendNext() {
    if (active || pending || channel?.readyState !== 'open') return;
    const file = outgoing.shift();
    if (file) { notice(); sendFile(file); }
    else { batchTotal = 0; batchDone = 0; }
  }
  function finishOutgoing(message, vars = {}) {
    stopTransfer(message, false, true, vars);
    batchDone++;
    if (outgoing.length) setTimeout(sendNext, 0);
    else { batchTotal = 0; batchDone = 0; }
  }
  function enqueueFiles(files) {
    if (!files?.length || channel?.readyState !== 'open' || active || pending) return;
    outgoing = [...files].map(file => ({ file, relativePath: file.webkitRelativePath || '' })); batchTotal = outgoing.length; batchDone = 0;
    sendNext();
  }
  async function pump(id) {
    try {
      const file = active?.file;
      if (!file || active.id !== id) return;
      while (active?.id === id && active.sent < file.size) {
        if (channel.readyState !== 'open') throw new Error('Connection closed');
        if (channel.bufferedAmount > 8 * 1024 * 1024) { await new Promise(resolve => { channel.addEventListener('bufferedamountlow', resolve, { once: true }); }); continue; }
        const part = await file.slice(active.sent, active.sent + chunkSize).arrayBuffer();
        if (active?.id !== id) return;
        channel.send(part); active.sent += part.byteLength;
        progress(active.sent, file.size, active.started, 'sending');
      }
      if (active?.id === id) { channel.send(JSON.stringify({ type: 'complete', id })); active.stage = 'finishing'; progressState = null; renderTransfer(); }
    } catch { if (active?.id === id) stopTransfer('transferFailed'); }
  }
  async function control(raw) {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'request') {
      if (active || pending || typeof msg.name !== 'string' || msg.name.length > 255 || !Number.isSafeInteger(msg.size) || msg.size < 0 || typeof msg.id !== 'string') { channel.send(JSON.stringify({ type: 'decline', id: msg.id })); return; }
      const safeName = msg.name.replace(/[\\/\x00-\x1f\x7f]/g, '_').trim() || 'download';
      const safePath = typeof msg.relativePath === 'string' ? msg.relativePath.split('/').filter(Boolean).map(part => part.replace(/[\\\x00-\x1f\x7f]/g, '_')).join('/') : '';
      pending = { id: msg.id, name: safeName, relativePath: safePath, size: msg.size };
      els['incoming-detail'].textContent = `${pending.relativePath || pending.name} · ${format(msg.size)}`;
      updateSaveNote();
      els.accept.disabled = !window.showSaveFilePicker && !supportsOpfs && msg.size > maxMemoryFile;
      els.incoming.hidden = false; els.accept.focus();
      status('incomingPrompt');
    }
    if (msg.type === 'accept' && active?.id === msg.id && active.direction === 'send') { active.accepted = true; pump(msg.id); }
    if (msg.type === 'decline' && active?.id === msg.id && active.direction === 'send') finishOutgoing('declined');
    if (msg.type === 'cancel') { if (pending?.id === msg.id) { pending = null; els.incoming.hidden = true; status(readyLabel, true); } if (active?.id === msg.id) { if (active.direction === 'send') finishOutgoing('peerCancelled'); else stopTransfer('peerCancelled', false); } }
    if (msg.type === 'complete' && active?.id === msg.id && active.direction === 'receive') {
      if (active.received !== active.size) { stopTransfer('incomplete'); return; }
      try {
        if (active.writer) await active.writer.close();
        if (active.opfs) {
          const file = await active.opfs.handle.getFile(); const url = URL.createObjectURL(file); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); active.opfs.root.removeEntry(active.opfs.tempName).catch(() => {});
        } else if (!active.writer) { const url = URL.createObjectURL(new Blob(active.chunks)); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); }
        channel.send(JSON.stringify({ type: 'saved', id: msg.id }));
        stopTransfer('received', false);
      } catch { stopTransfer('saveFailed'); }
    }
    if (msg.type === 'saved' && active?.id === msg.id && active.direction === 'send') finishOutgoing(batchTotal > 1 ? 'sentBatch' : 'sent', { current: batchDone + 1, total: batchTotal });
    if (msg.type === 'text' && typeof msg.text === 'string' && msg.text.length <= 4096) {
      try {
        const url = new URL(msg.text);
        if (!['http:', 'https:'].includes(url.protocol)) return;
        els['received-link'].href = url.href; els['received-link'].textContent = url.href; els['received-text'].hidden = false;
      } catch { /* Ignore malformed links. */ }
    }
  }
  async function receiveChunk(data) {
    if (!active || active.direction !== 'receive') return;
    if (active.received + data.byteLength > active.size) { stopTransfer('excess'); return; }
    try {
      if (active.writer) await active.writer.write(data); else active.chunks.push(data);
      active.received += data.byteLength;
      progress(active.received, active.size, active.started, 'receiving');
    } catch { stopTransfer('writeFailed'); }
  }
  els.accept.onclick = async () => {
    if (!pending || active) return;
    const request = pending;
    let writer, opfs;
    if (window.showSaveFilePicker) {
      try { const handle = await showSaveFilePicker({ suggestedName: request.name }); writer = await handle.createWritable(); }
      catch (error) { if (error.name === 'AbortError') return; notice('saveLocationFailed'); return; }
    } else if (supportsOpfs && request.size > maxMemoryFile) {
      try { const root = await navigator.storage.getDirectory(); const tempName = `blinksend-${crypto.randomUUID()}.part`; const handle = await root.getFileHandle(tempName, { create: true }); writer = await handle.createWritable(); opfs = { root, handle, tempName }; }
      catch { notice('saveLocationFailed'); return; }
    }
    if (pending?.id !== request.id) { writer?.abort(); return; }
    pending = null; els.incoming.hidden = true;
    active = { ...request, direction: 'receive', received: 0, chunks: writer ? null : [], writer, opfs, started: Date.now() };
    showTransfer(request.name, request.size);
    channel.send(JSON.stringify({ type: 'accept', id: request.id }));
  };
  els.decline.onclick = () => { if (pending) channel.send(JSON.stringify({ type: 'decline', id: pending.id })); pending = null; els.incoming.hidden = true; status(readyLabel, true); };
  els.cancel.onclick = () => stopTransfer('cancelled');
  els.file.onchange = () => enqueueFiles(els.file.files);
  els['choose-folder'].onclick = () => els.folder.click();
  els.folder.onchange = () => enqueueFiles(els.folder.files);
  function sendText() {
    if (channel?.readyState !== 'open') return;
    const value = els['share-text'].value.trim();
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      channel.send(JSON.stringify({ type: 'text', text: url.href }));
      els['share-text'].value = ''; notice('linkSent');
    } catch { notice('invalidLink'); }
  }
  els['send-text'].onclick = sendText;
  els['share-text'].onkeydown = e => { if (e.key === 'Enter') sendText(); };
  els['copy-received'].onclick = async () => { try { await navigator.clipboard.writeText(els['received-link'].href); } catch { /* Browser may deny clipboard access. */ } };
  els.drop.ondragover = e => { e.preventDefault(); if (!els.file.disabled) els.drop.classList.add('drag'); };
  els.drop.ondragleave = () => els.drop.classList.remove('drag');
  els.drop.ondrop = e => { e.preventDefault(); els.drop.classList.remove('drag'); if (!els.file.disabled) enqueueFiles(e.dataTransfer.files); };
  els.copy.onclick = async () => { try { await navigator.clipboard.writeText(roomLink()); els.copy.dataset.copied = 'true'; els.copy.textContent = tr('copied'); clearTimeout(copyTimer); copyTimer = setTimeout(() => { delete els.copy.dataset.copied; els.copy.textContent = tr('copy'); }, 1800); } catch { notice('copyFailed'); } };
  els['new-room'].onclick = () => { if (active) { notice('finishFirst'); return; } location.href = location.pathname; };
  setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'heartbeat' })); }, 30_000);
  applyLanguage();
  connect();
})();
