(() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['settings-toggle','settings-panel','settings-close','device-name','notify-complete','history-list','clear-history','mode-picker','mode-send','mode-receive','receive-join','join-link','join-room','join-back','resume-card','resume-detail','resume-transfer','discard-resume','transfer-workspace','invite-card','transfer-card','send-controls','receive-wait','qr','copy','new-room','status','status-dot','peer-name','connection-quality','verify-peer','verify-code','verify-match','file','folder','choose-folder','share-text','send-text','received-text','received-content','received-link','copy-received','share-received','share-last-file','drop','transfer-info','file-name','file-size','progress','progress-text','cancel','queue-status','notice','incoming','incoming-title','incoming-detail','save-note','accept','decline'].map(id => [id, $(id)]));
  const translations = {
  "en": {
    "language": "Language",
    "workspace": "File transfer",
    "headline": "Move files directly.",
    "intro": "No account, no cloud storage. Pick a side and connect.",
    "send": "Send",
    "receive": "Receive",
    "sendHelp": "Choose files or a folder, then share the QR code.",
    "receiveHelp": "Open or paste the invite link from the sending device.",
    "receiveFiles": "Receive files",
    "pasteInviteHelp": "Paste a BlinkSend invite link.",
    "invitePlaceholder": "https://…/#room",
    "join": "Join",
    "back": "Back",
    "resumeAvailable": "Unfinished transfer found",
    "resumeTransfer": "Resume transfer",
    "discard": "Discard",
    "connectDevice": "Connect a device",
    "scan": "Scan the code or open the invite link on your other device.",
    "qrAlt": "QR code for this room",
    "copy": "Copy invite link",
    "copied": "Link copied",
    "newRoom": "New room",
    "private": "Anyone with the link can join this room. Share it privately.",
    "files": "Files",
    "direction": "Choose what to send after the devices are verified.",
    "waitingForSender": "Ready to receive",
    "waitingForSenderHelp": "Keep this page open. Incoming files will appear here.",
    "incomingFolder": "Incoming folder",
    "saveFolder": "Choose destination",
    "folderPrompt": "%name% · %count% files · %size%",
    "folderUnsupported": "This browser cannot reconstruct folders directly. Files will be offered individually.",
    "resumePermission": "BlinkSend needs access to the original file to resume.",
    "resumeUnavailable": "This transfer cannot be resumed after reload on this browser.",
    "invalidInvite": "That does not look like a valid BlinkSend invite link.",
    "chooseFiles": "Choose files",
    "chooseFolder": "Choose folder",
    "textPlaceholder": "Paste text or a link",
    "sendText": "Send",
    "receivedText": "Received text",
    "copyText": "Copy",
    "share": "Share",
    "shareReceivedFile": "Share received file",
    "textSent": "Text sent.",
    "textTooLarge": "Text is too large. Keep it under 256 KB.",
    "settings": "Settings",
    "close": "Close",
    "deviceName": "Device name",
    "deviceNamePlaceholder": "My device",
    "completionFeedback": "Sound / vibration on completion",
    "history": "Transfer history",
    "clearHistory": "Clear",
    "noHistory": "No transfers yet.",
    "historyPrivate": "Stored only in this browser.",
    "dropHere": "or drop them here on a computer",
    "transferProgress": "Transfer progress",
    "cancel": "Cancel",
    "cancelBatch": "Cancel batch",
    "keepOpen": "Keep both tabs open until the transfer finishes.",
    "footer": "BlinkSend · Two devices per room",
    "incomingFile": "Incoming file",
    "decline": "Decline",
    "saveFile": "Save file",
    "verifyPeer": "Verify device",
    "verifyHelp": "Make sure both screens show the same code.",
    "codesMatch": "Codes match",
    "verifyStatus": "Connected — verify the code",
    "verified": "Device verified — connected",
    "verifiedReceived": "✓ Transfer complete — file verified.",
    "verifiedSent": "✓ Transfer complete — file verified by receiver.",
    "hashMismatch": "File verification failed. The received SHA-256 hash did not match.",
    "resuming": "Connection restored — resuming transfer…",
    "paused": "Connection interrupted — keeping transfer ready to resume…",
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
    "headline": "Flytta filer direkt.",
    "intro": "Inget konto, ingen molnlagring. Välj sida och anslut.",
    "send": "Skicka",
    "receive": "Ta emot",
    "sendHelp": "Välj filer eller en mapp och dela sedan QR-koden.",
    "receiveHelp": "Öppna eller klistra in inbjudningslänken från enheten som skickar.",
    "receiveFiles": "Ta emot filer",
    "pasteInviteHelp": "Klistra in en BlinkSend-inbjudningslänk.",
    "invitePlaceholder": "https://…/#rum",
    "join": "Anslut",
    "back": "Tillbaka",
    "resumeAvailable": "Oavslutad överföring hittades",
    "resumeTransfer": "Fortsätt överföringen",
    "discard": "Ta bort",
    "connectDevice": "Anslut en enhet",
    "scan": "Skanna koden eller öppna inbjudningslänken på din andra enhet.",
    "qrAlt": "QR-kod för det här rummet",
    "copy": "Kopiera inbjudningslänk",
    "copied": "Länken kopierad",
    "newRoom": "Nytt rum",
    "private": "Alla med länken kan ansluta till rummet. Dela den privat.",
    "files": "Filer",
    "direction": "Välj vad du vill skicka när enheterna är verifierade.",
    "waitingForSender": "Redo att ta emot",
    "waitingForSenderHelp": "Håll sidan öppen. Inkommande filer visas här.",
    "incomingFolder": "Inkommande mapp",
    "saveFolder": "Välj destination",
    "folderPrompt": "%name% · %count% filer · %size%",
    "folderUnsupported": "Den här webbläsaren kan inte återskapa mappar direkt. Filerna erbjuds en i taget.",
    "resumePermission": "BlinkSend behöver åtkomst till originalfilen för att fortsätta.",
    "resumeUnavailable": "Den här överföringen kan inte fortsätta efter omladdning i den här webbläsaren.",
    "invalidInvite": "Det där ser inte ut som en giltig BlinkSend-inbjudningslänk.",
    "chooseFiles": "Välj filer",
    "chooseFolder": "Välj mapp",
    "textPlaceholder": "Klistra in text eller en länk",
    "sendText": "Skicka",
    "receivedText": "Mottagen text",
    "copyText": "Kopiera",
    "share": "Dela",
    "shareReceivedFile": "Dela mottagen fil",
    "textSent": "Texten skickades.",
    "textTooLarge": "Texten är för stor. Håll den under 256 KB.",
    "settings": "Inställningar",
    "close": "Stäng",
    "deviceName": "Enhetsnamn",
    "deviceNamePlaceholder": "Min enhet",
    "completionFeedback": "Ljud / vibration när överföringen är klar",
    "history": "Överföringshistorik",
    "clearHistory": "Rensa",
    "noHistory": "Inga överföringar än.",
    "historyPrivate": "Sparas bara i den här webbläsaren.",
    "dropHere": "eller dra dem hit på en dator",
    "transferProgress": "Överföringsförlopp",
    "cancel": "Avbryt",
    "cancelBatch": "Avbryt alla",
    "keepOpen": "Håll båda flikarna öppna tills överföringen är klar.",
    "footer": "BlinkSend · Två enheter per rum",
    "incomingFile": "Inkommande fil",
    "decline": "Neka",
    "saveFile": "Spara fil",
    "verifyPeer": "Verifiera enhet",
    "verifyHelp": "Kontrollera att båda skärmarna visar samma kod.",
    "codesMatch": "Koderna matchar",
    "verifyStatus": "Ansluten — verifiera koden",
    "verified": "Enheten är verifierad — ansluten",
    "verifiedReceived": "✓ Överföringen är klar — filen är verifierad.",
    "verifiedSent": "✓ Överföringen är klar — mottagaren verifierade filen.",
    "hashMismatch": "Filverifieringen misslyckades. SHA-256-hashen matchade inte.",
    "resuming": "Anslutningen är tillbaka — fortsätter överföringen…",
    "paused": "Anslutningen bröts — överföringen sparas för återupptagning…",
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
  const maxTextBytes = 256 * 1024;
  const supportsOpfs = !!navigator.storage?.getDirectory;
  const format = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;
  let socket, pc, channel, pending, active, incomingQueue = Promise.resolve(), signalQueue = Promise.resolve(), connectTimer, iceToken = '';
  let readyLabel = 'ready', peerVerified = false, localVerified = false, remoteVerified = false, verificationCode = '';
  let outgoing = [], batchTotal = 0, batchDone = 0, mode = '', outgoingBatch = null, incomingBatch = null, resumeSession = null, peerName = '', lastReceivedFile = null;
  const roomPattern = /^[a-f0-9]{32}$/;
  let room = location.hash.slice(1).toLowerCase();
  if (!roomPattern.test(room)) room = '';
  const sessionKey = () => room ? `active:${room}` : '';
  const roomLink = () => `${location.origin}${location.pathname}#${room}`;
  const newRoomId = () => [...crypto.getRandomValues(new Uint8Array(16))].map(v => v.toString(16).padStart(2,'0')).join('');
  function updateRoomUi() { if (room) els.qr.src = `/qr?url=${encodeURIComponent(roomLink())}`; }
  function setRole(value) {
    mode = value;
    els['mode-picker'].hidden = true; els['receive-join'].hidden = true; els['transfer-workspace'].hidden = false;
    els['invite-card'].hidden = value !== 'send';
    els['transfer-workspace'].classList.toggle('receive-mode', value === 'receive');
    els['send-controls'].hidden = value !== 'send'; els['receive-wait'].hidden = value !== 'receive';
    if (room) { try { sessionStorage.setItem(`blinksend-role:${room}`, value); } catch {} }
  }
  const sanitizeDeviceName = value => String(value || '').replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,64);
  let deviceName = sanitizeDeviceName(readSetting('blinksend-device-name')) || 'BlinkSend device';
  let completionFeedback = readSetting('blinksend-completion-feedback') === '1';
  async function renderHistory() {
    if (!window.BlinkStore?.listHistory) return;
    try {
      const items=await BlinkStore.listHistory(20);
      els['history-list'].innerHTML='';
      if(!items.length){const p=document.createElement('p');p.className='hint';p.textContent=tr('noHistory');els['history-list'].append(p);return;}
      for(const item of items){
        const row=document.createElement('div');row.className='history-item';
        const name=document.createElement('strong');name.textContent=item.name || 'Transfer';
        const size=document.createElement('span');size.textContent=format(item.size||0);
        const detail=document.createElement('span');detail.textContent=`${item.direction==='send'?'Sent':'Received'} · ${item.verified?'SHA-256 verified':'Completed'}`;
        const when=document.createElement('span');when.textContent=new Date(item.createdAt).toLocaleString(language==='sv'?'sv-SE':'en');
        row.append(name,size,detail,when);els['history-list'].append(row);
      }
    } catch {}
  }
  async function recordHistory(entry){try{await BlinkStore?.addHistory?.(entry);await renderHistory();}catch{}}
  function completionCue(){
    if(!completionFeedback)return;
    try{navigator.vibrate?.([35,25,35]);}catch{}
    try{const C=window.AudioContext||window.webkitAudioContext;if(C){const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=660;g.gain.value=.035;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.09);o.onended=()=>ctx.close();}}catch{}
  }
  function status(key, ready = false, vars = {}) {
    lastStatus = { key, ready, vars };
    els.status.textContent = tr(key, vars);
    els['status-dot'].classList.toggle('ready', ready);
    els['peer-name'].textContent = peerName ? peerName : '';
    const unlocked = ready && peerVerified && mode === 'send';
    els.file.disabled = !unlocked || !!active || !!pending;
    els.folder.disabled = els.file.disabled;
    els['choose-folder'].disabled = els.file.disabled;
    els['share-text'].disabled = !unlocked;
    els['send-text'].disabled = !unlocked;
    els.drop.classList.toggle('disabled', els.file.disabled);
  }
  function notice(key = '', vars = {}) { lastNotice = { key, vars }; els.notice.textContent = key ? tr(key, vars) : ''; }
  function signal(type, payload) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload })); }
  function pauseTransfer() {
    if (!active) return;
    active.paused = true; active.stage = 'paused'; progressState = null; renderTransfer();
  }
  function resetPeer() {
    clearTimeout(connectTimer);
    pauseTransfer();
    pending = null; els.incoming.hidden = true;
    peerVerified = false; localVerified = false; remoteVerified = false; verificationCode = ''; els['verify-peer'].hidden = true;
    channel?.close(); pc?.close(); channel = null; pc = null;
    status('waiting');
  }
  function fingerprint(desc) {
    const match = desc?.sdp?.match(/^a=fingerprint:sha-256\s+([A-Fa-f0-9:]+)/mi);
    return match ? match[1].replace(/:/g, '').toLowerCase() : '';
  }
  async function showVerificationCode() {
    const local = fingerprint(pc?.localDescription), remote = fingerprint(pc?.remoteDescription);
    if (!local || !remote) return;
    const material = [local, remote].sort().join(':');
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(material)));
    const value = (((digest[0] * 0x1000000) + (digest[1] << 16) + (digest[2] << 8) + digest[3]) >>> 0) % 1000000;
    const code = String(value).padStart(6, '0'), display = `${code.slice(0,3)} ${code.slice(3)}`;
    if (display === verificationCode && peerVerified) return;
    verificationCode = display; els['verify-code'].textContent = display; els['verify-match'].disabled = false;
    els['verify-peer'].hidden = false; peerVerified = false; localVerified = false; remoteVerified = false; status('verifyStatus', false);
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
      await showVerificationCode();
    } catch { if (pc === current && channel?.readyState === 'open') await showVerificationCode(); }
  }
  async function makePeer() {
    pc?.close();
    clearTimeout(connectTimer);
    let iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    try { const response = await fetch(`/ice?token=${encodeURIComponent(iceToken)}`, { signal: AbortSignal.timeout(5000) }); if (response.ok) iceServers = (await response.json()).iceServers; } catch { /* Default STUN is sufficient for many networks. */ }
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
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { pauseTransfer(); status(active ? 'paused' : 'interrupted'); }
    };
    pc.ondatachannel = e => setupChannel(e.channel);
  }
  function setupChannel(ch) {
    channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.bufferedAmountLowThreshold = 2 * 1024 * 1024;
    ch.onopen = () => {
      clearTimeout(connectTimer); connectionPath(); notice();
      ch.send(JSON.stringify({type:'hello',name:deviceName}));
      if (active) { active.paused = true; active.stage = 'resuming'; renderTransfer(); }
    };
    ch.onclose = () => { pauseTransfer(); status(active ? 'paused' : 'peerLeft'); };
    ch.onmessage = e => {
      incomingQueue = incomingQueue.then(() => typeof e.data === 'string' ? control(e.data) : receiveChunk(e.data)).catch(() => {
        if (active) stopTransfer('transferFailed');
      });
    };
  }
  function connect() {
    if (!room || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    socket = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/signal`);
    socket.onopen = () => socket.send(JSON.stringify({ type: 'join', room }));
    socket.onmessage = e => { signalQueue = signalQueue.then(async () => {
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      try {
        if (msg.type === 'joined') { iceToken = typeof msg.iceToken === 'string' ? msg.iceToken : ''; status(msg.count === 1 ? 'waiting' : 'connecting'); }
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
  async function ensurePermission(handle, access = 'read') {
    if (!handle?.queryPermission) return true;
    const opts = { mode: access };
    if (await handle.queryPermission(opts) === 'granted') return true;
    return handle.requestPermission ? (await handle.requestPermission(opts)) === 'granted' : false;
  }
  async function persistSendSession(entry) {
    if (!window.BlinkStore || !entry?.handle || !room || !active) return;
    const batchEntries = outgoingBatch?.entries?.filter(x => x.handle).map(x => ({ handle:x.handle, name:x.file?.name || x.name, size:x.file?.size ?? x.size, relativePath:x.relativePath })) || null;
    try { await BlinkStore.put({ id:sessionKey(), room, role:'send', transferId:active.id, handle:entry.handle, name:active.file.name, size:active.file.size, relativePath:active.relativePath, batchId:outgoingBatch?.id || null, batchName:outgoingBatch?.name || null, batchEntries, batchDone }); } catch {}
  }
  async function persistReceiveSession() {
    if (!window.BlinkStore || !active?.persistentHandle || !room) return;
    try { await BlinkStore.put({ id:sessionKey(), room, role:'receive', transferId:active.id, handle:active.persistentHandle, name:active.name, size:active.size, relativePath:active.relativePath, received:active.committedBytes || 0, nextChunk:Math.floor((active.committedBytes || 0)/chunkSize), batchId:incomingBatch?.id || null, batchName:incomingBatch?.name || null, batchRootHandle:incomingBatch?.rootHandle || null, opfs:!!active.opfs, opfsTempName:active.opfs?.tempName || null }); } catch {}
  }
  async function persistBatchContext() {
    if (!window.BlinkStore || !room || !incomingBatch?.rootHandle) return;
    try { await BlinkStore.put({ id:`batch:${room}`, room, role:'receive-batch', batchId:incomingBatch.id, batchName:incomingBatch.name, batchRootHandle:incomingBatch.rootHandle }); } catch {}
  }
  async function clearPersistent() { if (window.BlinkStore && room) { try { await BlinkStore.remove(sessionKey()); } catch {} } }
  async function clearBatchContext() { if (window.BlinkStore && room) { try { await BlinkStore.remove(`batch:${room}`); } catch {} } }
  async function rebuildReceiveHasher(handle, bytes) {
    const file = await handle.getFile(); return hashPrefix(file, Math.min(bytes, file.size));
  }
  async function nestedFileHandle(root, relativePath, fallbackName) {
    const parts = (relativePath || fallbackName).split('/').filter(Boolean);
    let dir = root;
    for (const part of parts.slice(0,-1)) dir = await dir.getDirectoryHandle(part, { create:true });
    return dir.getFileHandle(parts.at(-1) || fallbackName, { create:true });
  }
  async function collectDirectory(handle, prefix = '') {
    const entries = [];
    for await (const [name, child] of handle.entries()) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (child.kind === 'directory') entries.push(...await collectDirectory(child, path));
      else { const file = await child.getFile(); entries.push({ file, handle:child, relativePath:path }); }
    }
    return entries;
  }
  async function hashPrefix(file, bytes) {
    const hasher = new BlinkSHA256(); let offset = 0;
    while (offset < bytes) { const part = await file.slice(offset, Math.min(bytes, offset + chunkSize)).arrayBuffer(); hasher.update(part); offset += part.byteLength; }
    return hasher;
  }
  function packChunk(seq, part) {
    const payload = new Uint8Array(part), packet = new Uint8Array(payload.length + 4);
    new DataView(packet.buffer).setUint32(0, seq); packet.set(payload, 4); return packet.buffer;
  }
  function maybeFinishVerification() {
    if (!localVerified || !remoteVerified || peerVerified) return;
    peerVerified = true; els['verify-peer'].hidden = true; status('verified', true);
    if (active?.direction === 'receive' && active.paused && channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'resume', id: active.id, nextChunk: active.nextChunk || 0, size: active.size }));
    if (active?.direction === 'send' && Number.isSafeInteger(active.pendingResume)) { const next = active.pendingResume; delete active.pendingResume; resumeOutgoing(next); }
  }
  async function resumeOutgoing(nextChunk) {
    if (!active || active.direction !== 'send' || !Number.isSafeInteger(nextChunk) || nextChunk < 0) return;
    const offset = Math.min(active.file.size, nextChunk * chunkSize); active.sent = offset; active.nextChunk = nextChunk;
    active.hasher = await hashPrefix(active.file, offset); active.paused = false; active.stage = 'resuming';
    progress(offset, active.file.size, active.started, 'sending'); pump(active.id);
  }
  async function sendFile(entry) {
    if (!entry || channel?.readyState !== 'open' || active || pending) return;
    const file = entry.file || entry;
    const relativePath = entry.relativePath || file.webkitRelativePath || '';
    const id = entry.transferId || crypto.randomUUID(); active = { id, direction: 'send', file, sourceEntry:entry, relativePath, batchId:outgoingBatch?.id || entry.batchId || null, sent: 0, nextChunk: 0, hasher: new BlinkSHA256(), started: Date.now(), accepted: false, paused: false };
    showTransfer(relativePath || file.name, file.size);
    await persistSendSession(entry);
    channel.send(JSON.stringify({ type: 'request', id, name: file.name, relativePath, size: file.size, batchId:active.batchId }));
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
    else { if (outgoingBatch?.id && channel?.readyState === 'open') channel.send(JSON.stringify({type:'batch-complete',id:outgoingBatch.id})); batchTotal = 0; batchDone = 0; outgoingBatch = null; clearPersistent(); }
  }
  function enqueueEntries(entries, folderName = '') {
    if (!entries?.length || channel?.readyState !== 'open' || active || pending) return;
    outgoing = entries.map(entry => entry.file ? entry : ({ file:entry, relativePath:entry.webkitRelativePath || '' }));
    batchTotal = outgoing.length; batchDone = 0;
    const isFolder = !!folderName || outgoing.some(x => x.relativePath);
    if (isFolder && outgoing.length) {
      const id = crypto.randomUUID();
      const name = folderName || outgoing[0].relativePath.split('/')[0] || 'Folder';
      outgoingBatch = { id, name, entries:[...outgoing] };
      const totalSize = outgoing.reduce((sum,x)=>sum+x.file.size,0);
      channel.send(JSON.stringify({ type:'batch-request', id, name, count:outgoing.length, totalSize }));
    } else sendNext();
  }
  function enqueueFiles(files) { enqueueEntries([...files].map(file => ({ file, relativePath:file.webkitRelativePath || '' }))); }
  async function pump(id) {
    try {
      const file = active?.file;
      if (!file || active.id !== id) return;
      while (active?.id === id && !active.paused && active.sent < file.size) {
        if (channel.readyState !== 'open') throw new Error('Connection closed');
        if (channel.bufferedAmount > 8 * 1024 * 1024) { await new Promise(resolve => { channel.addEventListener('bufferedamountlow', resolve, { once: true }); }); continue; }
        const seq = active.nextChunk; const part = await file.slice(active.sent, active.sent + chunkSize).arrayBuffer();
        if (active?.id !== id || active.paused) return;
        active.hasher.update(part); channel.send(packChunk(seq, part)); active.sent += part.byteLength; active.nextChunk++;
        progress(active.sent, file.size, active.started, 'sending');
      }
      if (active?.id === id && !active.paused) { channel.send(JSON.stringify({ type: 'complete', id, sha256: active.hasher.hex() })); active.stage = 'finishing'; progressState = null; renderTransfer(); }
    } catch { if (active?.id === id) { pauseTransfer(); status('paused'); } }
  }
  async function control(raw) {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'hello') { peerName=sanitizeDeviceName(msg.name); els['peer-name'].textContent=peerName; return; }
    if (msg.type === 'batch-request') {
      if (active || pending || !msg.id || typeof msg.name !== 'string' || !Number.isSafeInteger(msg.count) || msg.count < 1 || !Number.isSafeInteger(msg.totalSize) || msg.totalSize < 0) return;
      pending = { type:'batch', id:msg.id, name:msg.name.replace(/[\\/\x00-\x1f\x7f]/g,'_').trim() || 'Folder', count:msg.count, totalSize:msg.totalSize };
      els['incoming-title'].textContent = tr('incomingFolder');
      els['incoming-detail'].textContent = tr('folderPrompt', { name:pending.name, count:pending.count, size:format(pending.totalSize) });
      els['save-note'].textContent = window.showDirectoryPicker ? tr('saveFolder') : tr('folderUnsupported');
      els.accept.disabled = false; els.incoming.hidden = false; els.accept.focus(); status('incomingPrompt');
      return;
    }
    if (msg.type === 'batch-accept' && outgoingBatch?.id === msg.id) { sendNext(); return; }
    if (msg.type === 'batch-decline' && outgoingBatch?.id === msg.id) { outgoing=[]; outgoingBatch=null; batchTotal=0; batchDone=0; notice('declined'); return; }
    if (msg.type === 'batch-complete' && incomingBatch?.id === msg.id) { incomingBatch=null; await clearBatchContext(); return; }
    if (msg.type === 'request') {
      if (active || pending || typeof msg.name !== 'string' || msg.name.length > 255 || !Number.isSafeInteger(msg.size) || msg.size < 0 || typeof msg.id !== 'string') { channel.send(JSON.stringify({ type: 'decline', id: msg.id })); return; }
      const safeName = msg.name.replace(/[\\/\x00-\x1f\x7f]/g, '_').trim() || 'download';
      const safePath = typeof msg.relativePath === 'string' ? msg.relativePath.split('/').filter(Boolean).map(part => part.replace(/[\\\x00-\x1f\x7f]/g, '_')).join('/') : '';
      pending = { id: msg.id, name: safeName, relativePath: safePath, size: msg.size, batchId:typeof msg.batchId === 'string' ? msg.batchId : null };
      if (pending.batchId && incomingBatch?.id === pending.batchId && incomingBatch.accepted) { await acceptPendingFile(true); return; }
      els['incoming-title'].textContent = tr('incomingFile');
      els['incoming-detail'].textContent = `${pending.relativePath || pending.name} · ${format(msg.size)}`;
      updateSaveNote();
      els.accept.disabled = !window.showSaveFilePicker && !supportsOpfs && msg.size > maxMemoryFile;
      els.incoming.hidden = false; els.accept.focus();
      status('incomingPrompt');
    }
    if (msg.type === 'accept' && active?.id === msg.id && active.direction === 'send') { active.accepted = true; active.paused = false; pump(msg.id); }
    if (msg.type === 'resume' && active?.id === msg.id && active.direction === 'send' && Number.isSafeInteger(msg.nextChunk) && msg.nextChunk >= 0) {
      if (!peerVerified) active.pendingResume = msg.nextChunk; else await resumeOutgoing(msg.nextChunk);
    }
    if (msg.type === 'verify-confirm') { remoteVerified = true; maybeFinishVerification(); }
    if (msg.type === 'decline' && active?.id === msg.id && active.direction === 'send') finishOutgoing('declined');
    if (msg.type === 'cancel') { if (pending?.id === msg.id) { pending = null; els.incoming.hidden = true; status(readyLabel, true); } if (active?.id === msg.id) { if (active.direction === 'send') finishOutgoing('peerCancelled'); else stopTransfer('peerCancelled', false); } }
    if (msg.type === 'complete' && active?.id === msg.id && active.direction === 'receive') {
      if (active.received !== active.size) { stopTransfer('incomplete'); return; }
      const localHash = active.hasher.hex(); if (typeof msg.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(msg.sha256) || localHash !== msg.sha256) { stopTransfer('hashMismatch'); return; }
      try {
        if (active.writer) await active.writer.close();
        if (active.opfs) {
          const file = await active.opfs.handle.getFile(); const url = URL.createObjectURL(file); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); active.opfs.root.removeEntry(active.opfs.tempName).catch(() => {});
        } else if (!active.writer) { const url = URL.createObjectURL(new Blob(active.chunks)); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); }
        channel.send(JSON.stringify({ type: 'saved', id: msg.id, sha256: localHash }));
        let shareFile=null;
        try {
          if (active.persistentHandle) shareFile=await active.persistentHandle.getFile();
          else if (active.opfs?.handle) shareFile=await active.opfs.handle.getFile();
          else if (active.chunks) shareFile=new File(active.chunks,active.name,{type:'application/octet-stream'});
        } catch {}
        lastReceivedFile=shareFile;
        els['share-last-file'].hidden=!(shareFile && navigator.share && (!navigator.canShare || navigator.canShare({files:[shareFile]})));
        await recordHistory({name:active.relativePath||active.name,size:active.size,direction:'receive',verified:true,sha256:localHash});
        completionCue();
        await clearPersistent();
        stopTransfer('verifiedReceived', false);
      } catch { stopTransfer('saveFailed'); }
    }
    if (msg.type === 'saved' && active?.id === msg.id && active.direction === 'send') {
      const sentHash = active.hasher.hex(); if (msg.sha256 !== sentHash) { stopTransfer('hashMismatch', false); return; }
      await recordHistory({name:active.relativePath||active.file.name,size:active.file.size,direction:'send',verified:true,sha256:sentHash});
      completionCue();
      finishOutgoing('verifiedSent', { current: batchDone + 1, total: batchTotal });
    }
    if (msg.type === 'text' && typeof msg.text === 'string') {
      const bytes=new TextEncoder().encode(msg.text).byteLength;if(bytes>maxTextBytes)return;
      els['received-content'].textContent=msg.text;els['received-text'].hidden=false;
      let link='';try{const u=new URL(msg.text.trim());if(['http:','https:'].includes(u.protocol))link=u.href;}catch{}
      els['received-link'].hidden=!link;if(link){els['received-link'].href=link;els['received-link'].textContent=link;}
      await recordHistory({name:link||'Text',size:bytes,direction:'receive',verified:false,type:'text'});
      completionCue();
    }
  }
  async function receiveChunk(data) {
    if (!active || active.direction !== 'receive') return;
    const packet = new Uint8Array(data); if (packet.byteLength < 4) return;
    const seq = new DataView(packet.buffer, packet.byteOffset, packet.byteLength).getUint32(0), payload = packet.subarray(4);
    if (seq < active.nextChunk) return;
    if (seq !== active.nextChunk) { if (channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'resume', id: active.id, nextChunk: active.nextChunk, size: active.size })); return; }
    if (active.received + payload.byteLength > active.size) { stopTransfer('excess'); return; }
    try {
      active.hasher.update(payload);
      if (active.writer) await active.writer.write(payload); else active.chunks.push(payload.slice());
      active.received += payload.byteLength; active.nextChunk++;
      if (active.persistentHandle && active.writer && active.received - (active.committedBytes || 0) >= 8 * 1024 * 1024) {
        await active.writer.close(); active.committedBytes = active.received;
        await persistReceiveSession();
        active.writer = await active.persistentHandle.createWritable({ keepExistingData:true }); await active.writer.seek(active.received);
      }
      progress(active.received, active.size, active.started, 'receiving');
    } catch { stopTransfer('writeFailed'); }
  }
  async function acceptPendingFile(fromBatch = false) {
    if (!pending || active || pending.type === 'batch') return;
    const request = pending;
    let writer, opfs, persistentHandle;
    if (fromBatch && incomingBatch?.rootHandle) {
      try { const parts=(request.relativePath || request.name).split('/').filter(Boolean); if (parts[0] === incomingBatch.name) parts.shift(); persistentHandle = await nestedFileHandle(incomingBatch.rootHandle, parts.join('/'), request.name); writer = await persistentHandle.createWritable(); }
      catch { notice('saveLocationFailed'); return; }
    } else if (window.showSaveFilePicker) {
      try { persistentHandle = await showSaveFilePicker({ suggestedName: request.name }); writer = await persistentHandle.createWritable(); }
      catch (error) { if (error.name === 'AbortError') return; notice('saveLocationFailed'); return; }
    } else if (supportsOpfs && request.size > maxMemoryFile) {
      try { const root = await navigator.storage.getDirectory(); const tempName = `blinksend-${crypto.randomUUID()}.part`; const handle = await root.getFileHandle(tempName, { create: true }); writer = await handle.createWritable(); opfs = { root, handle, tempName }; persistentHandle = handle; }
      catch { notice('saveLocationFailed'); return; }
    }
    if (pending?.id !== request.id) { writer?.abort(); return; }
    pending = null; els.incoming.hidden = true;
    active = { ...request, direction:'receive', received:0, committedBytes:0, nextChunk:0, hasher:new BlinkSHA256(), chunks:writer ? null : [], writer, opfs, persistentHandle, started:Date.now(), paused:false };
    showTransfer(request.relativePath || request.name, request.size);
    await persistReceiveSession();
    channel.send(JSON.stringify({ type:'accept', id:request.id }));
  }
  els.accept.onclick = async () => {
    if (!pending || active) return;
    if (pending.type === 'batch') {
      const request = pending; let rootHandle = null;
      if (window.showDirectoryPicker) {
        try {
          const parent = await showDirectoryPicker({ mode:'readwrite' });
          rootHandle = await parent.getDirectoryHandle(request.name, { create:true });
        } catch (error) { if (error.name === 'AbortError') return; notice('saveLocationFailed'); return; }
      }
      incomingBatch = { id:request.id, name:request.name, rootHandle, accepted:true };
      await persistBatchContext();
      pending = null; els.incoming.hidden = true; channel.send(JSON.stringify({ type:'batch-accept', id:request.id })); status('verified', true); return;
    }
    await acceptPendingFile(false);
  };
  els.decline.onclick = () => { if (pending) channel.send(JSON.stringify({ type: pending.type === 'batch' ? 'batch-decline' : 'decline', id: pending.id })); pending = null; els.incoming.hidden = true; status(peerVerified ? 'verified' : 'verifyStatus', peerVerified); };
  els['verify-match'].onclick = () => { if (localVerified || channel?.readyState !== 'open') return; localVerified = true; els['verify-match'].disabled = true; channel.send(JSON.stringify({ type: 'verify-confirm' })); maybeFinishVerification(); };
  els.cancel.onclick = () => stopTransfer('cancelled');
  els.file.onchange = () => enqueueFiles(els.file.files);
  els.drop.onclick = async e => {
    if (els.file.disabled || !window.showOpenFilePicker) return;
    e.preventDefault();
    try {
      const handles = await showOpenFilePicker({ multiple:true });
      const entries=[]; for (const handle of handles) entries.push({ handle, file:await handle.getFile(), relativePath:'' });
      enqueueEntries(entries);
    } catch (error) { if (error.name !== 'AbortError') els.file.click(); }
  };
  els['choose-folder'].onclick = async () => {
    if (els.folder.disabled) return;
    if (!window.showDirectoryPicker) { els.folder.click(); return; }
    try { const handle = await showDirectoryPicker({ mode:'read' }); const entries = await collectDirectory(handle, handle.name); enqueueEntries(entries, handle.name); }
    catch (error) { if (error.name !== 'AbortError') notice('saveLocationFailed'); }
  };
  els.folder.onchange = () => { const files=[...els.folder.files]; const name=files[0]?.webkitRelativePath?.split('/')[0] || ''; enqueueEntries(files.map(file=>({file,relativePath:file.webkitRelativePath||''})), name); };
  async function sendTextValue(value) {
    if(channel?.readyState!=='open'||!peerVerified)return;
    const text=String(value||'');if(!text.trim())return;
    const bytes=new TextEncoder().encode(text).byteLength;if(bytes>maxTextBytes){notice('textTooLarge');return;}
    channel.send(JSON.stringify({type:'text',text}));
    await recordHistory({name:'Text',size:bytes,direction:'send',verified:false,type:'text'});
    notice('textSent');
  }
  async function sendText(){const value=els['share-text'].value;await sendTextValue(value);els['share-text'].value='';}
  els['send-text'].onclick = sendText;
  els['share-text'].onkeydown = e => { if (e.key === 'Enter') sendText(); };
  els['copy-received'].onclick=async()=>{try{await navigator.clipboard.writeText(els['received-content'].textContent||'');}catch{}};
  els['share-received'].onclick=async()=>{const text=els['received-content'].textContent||'';try{if(navigator.share)await navigator.share({text});}catch{}};
  els['share-last-file'].onclick=async()=>{try{if(lastReceivedFile&&navigator.share)await navigator.share({files:[lastReceivedFile],title:lastReceivedFile.name});}catch{}};
  document.addEventListener('paste',e=>{
    if(mode!=='send'||!peerVerified||['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
    const files=[...(e.clipboardData?.files||[])];
    if(files.length){e.preventDefault();enqueueFiles(files);return;}
    const text=e.clipboardData?.getData('text/plain');if(text){e.preventDefault();sendTextValue(text);}
  });
  els.drop.ondragover = e => { e.preventDefault(); if (!els.file.disabled) els.drop.classList.add('drag'); };
  els.drop.ondragleave = () => els.drop.classList.remove('drag');
  els.drop.ondrop = e => { e.preventDefault(); els.drop.classList.remove('drag'); if (!els.file.disabled) enqueueFiles(e.dataTransfer.files); };
  els.copy.onclick = async () => { try { await navigator.clipboard.writeText(roomLink()); els.copy.dataset.copied = 'true'; els.copy.textContent = tr('copied'); clearTimeout(copyTimer); copyTimer = setTimeout(() => { delete els.copy.dataset.copied; els.copy.textContent = tr('copy'); }, 1800); } catch { notice('copyFailed'); } };
  els['new-room'].onclick = () => { if (active) { notice('finishFirst'); return; } location.href = location.pathname; };
  function startSend() {
    if (!room) { room = newRoomId(); history.replaceState(null,'',`${location.pathname}#${room}`); }
    setRole('send'); updateRoomUi(); connect(); checkResume();
  }
  function startReceiveRoom(targetRoom) {
    room = targetRoom; history.replaceState(null,'',`${location.pathname}#${room}`); setRole('receive'); updateRoomUi(); connect(); checkResume();
  }
  els['mode-send'].onclick = startSend;
  els['mode-receive'].onclick = () => { els['mode-picker'].hidden = true; els['receive-join'].hidden = false; els['join-link'].focus(); };
  els['join-back'].onclick = () => { els['receive-join'].hidden = true; els['mode-picker'].hidden = false; };
  els['join-room'].onclick = () => {
    try { const url = new URL(els['join-link'].value.trim(), location.origin); const id=url.hash.slice(1).toLowerCase(); if (url.origin !== location.origin || !roomPattern.test(id)) throw new Error(); startReceiveRoom(id); }
    catch { notice('invalidInvite'); }
  };
  async function checkResume() {
    if (!window.BlinkStore || !room) return;
    try {
      const sessions = await BlinkStore.findRoom(room); resumeSession = sessions[0] || null;
      const batchContext = sessions.find(x => x.role === 'receive-batch');
      if (batchContext?.batchRootHandle) incomingBatch = { id:batchContext.batchId, name:batchContext.batchName, rootHandle:batchContext.batchRootHandle, accepted:true };
      resumeSession = sessions.find(x => x.role === 'send' || x.role === 'receive') || null;
      if (resumeSession) { els['resume-detail'].textContent = `${resumeSession.relativePath || resumeSession.name || 'Transfer'} · ${format(resumeSession.size || 0)}`; els['resume-card'].hidden = false; }
    } catch {}
  }
  async function restoreSession() {
    const s=resumeSession; if (!s?.handle) { notice('resumeUnavailable'); return; }
    const access = s.role === 'receive' ? 'readwrite' : 'read';
    try { if (!(await ensurePermission(s.handle, access))) { notice('resumePermission'); return; } } catch { notice('resumePermission'); return; }
    if (s.role === 'send') {
      const file=await s.handle.getFile(); mode='send'; setRole('send');
      outgoingBatch = s.batchId ? { id:s.batchId, name:s.batchName || 'Folder', entries:(s.batchEntries || []).map(x=>x) } : null;
      batchTotal = s.batchEntries?.length || 1; batchDone = s.batchDone || 0;
      if (s.batchEntries?.length) {
        const idx=s.batchEntries.findIndex(x=>x.name===s.name && x.relativePath===s.relativePath);
        outgoing = s.batchEntries.slice(Math.max(0,idx+1)).map(x=>({ ...x, file:null }));
        for (const entry of outgoing) entry.file = await entry.handle.getFile();
      }
      active={ id:s.transferId, direction:'send', file, sourceEntry:{handle:s.handle,file,relativePath:s.relativePath}, relativePath:s.relativePath||'', batchId:s.batchId||null, sent:0,nextChunk:0,hasher:new BlinkSHA256(),started:Date.now(),accepted:true,paused:true };
      showTransfer(s.relativePath || s.name, s.size); active.stage='resuming'; renderTransfer();
    } else {
      const existing=await s.handle.getFile(); const bytes=Math.min(s.received||0,existing.size);
      const writer=await s.handle.createWritable({keepExistingData:true}); await writer.seek(bytes);
      incomingBatch = s.batchId ? { id:s.batchId, name:s.batchName, rootHandle:s.batchRootHandle, accepted:true } : null;
      let restoredOpfs=null; if (s.opfs && s.opfsTempName) { const root=await navigator.storage.getDirectory(); restoredOpfs={root,handle:s.handle,tempName:s.opfsTempName}; }
      active={ id:s.transferId,direction:'receive',name:s.name,size:s.size,relativePath:s.relativePath||'',received:bytes,committedBytes:bytes,nextChunk:Math.floor(bytes/chunkSize),hasher:await rebuildReceiveHasher(s.handle,bytes),chunks:null,writer,persistentHandle:s.handle,opfs:restoredOpfs,started:Date.now(),paused:true,batchId:s.batchId||null };
      showTransfer(s.relativePath || s.name,s.size); active.stage='resuming'; renderTransfer();
    }
    els['resume-card'].hidden=true; resumeSession=null;
  }
  els['resume-transfer'].onclick = restoreSession;
  els['discard-resume'].onclick = async () => { await clearPersistent(); await clearBatchContext(); resumeSession=null; incomingBatch=null; els['resume-card'].hidden=true; };
  els['settings-toggle'].onclick=()=>{els['settings-panel'].hidden=!els['settings-panel'].hidden;if(!els['settings-panel'].hidden)renderHistory();};
  els['settings-close'].onclick=()=>{els['settings-panel'].hidden=true;};
  els['device-name'].value=deviceName;
  els['device-name'].onchange=()=>{deviceName=sanitizeDeviceName(els['device-name'].value)||'BlinkSend device';els['device-name'].value=deviceName;saveSetting('blinksend-device-name',deviceName);if(channel?.readyState==='open')channel.send(JSON.stringify({type:'hello',name:deviceName}));};
  els['notify-complete'].checked=completionFeedback;
  els['notify-complete'].onchange=()=>{completionFeedback=els['notify-complete'].checked;saveSetting('blinksend-completion-feedback',completionFeedback?'1':'0');};
  els['clear-history'].onclick=async()=>{try{await BlinkStore?.clearHistory?.();}catch{}await renderHistory();};
  async function initMode() {
    if (room) {
      let role='receive'; try { role=sessionStorage.getItem(`blinksend-role:${room}`) || 'receive'; } catch {}
      setRole(role); updateRoomUi(); connect(); await checkResume();
    } else { els['mode-picker'].hidden=false; els['transfer-workspace'].hidden=true; }
  }
  setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'heartbeat' })); }, 30_000);
  applyLanguage();
  initMode();
})();
