(() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['install-app','settings-toggle','settings-panel','settings-close','device-name','notify-complete','nearby-discovery','nearby-code','history-list','clear-history','recent-peers','diagnostics-toggle','diagnostics-panel','diag-connection','diag-transport','diag-rtt','diag-measured','diag-chunk','diag-buffer','diag-reconnects','diag-capabilities','mode-picker','mode-send','mode-receive','receive-join','join-link','join-room','join-code','join-code-button','join-back','scan-qr','find-nearby','nearby-results','qr-scanner','scanner-video','scanner-help','scanner-close','resume-card','resume-detail','resume-transfer','discard-resume','transfer-workspace','invite-card','pair-code-wrap','pair-code','pair-code-help','transfer-card','send-controls','receive-wait','qr','copy','new-room','status','status-dot','peer-name','connection-quality','verify-peer','verify-code','verify-match','file','folder','choose-folder','share-text','send-text','received-text','received-content','received-link','copy-received','share-received','share-last-file','drop','queue-panel','queue-summary','queue-list','clear-queue','transfer-state-banner','transfer-info','batch-summary','file-name','file-size','progress','progress-text','cancel','queue-status','post-transfer','send-another','notice','incoming','incoming-title','incoming-detail','save-note','accept','decline'].map(id => [id, $(id)]));
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
    "codePlaceholder": "ABCD-EFGH",
    "joinCode": "Use code",
    "pairCode": "Pairing code",
    "pairCodeHelp": "Type this code on the receiving device. It expires after 10 minutes.",
    "pairCodeUntil": "Valid until %time%. The six-digit verification check is still required.",
    "invalidCode": "That pairing code is invalid or expired.",
    "serverRestarting": "Server restarting — reconnecting…",
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
    "install": "Install",
    "sharedReady": "Shared items are ready. Connect the receiving device to send them.",
    "settings": "Settings",
    "close": "Close",
    "deviceName": "Device name",
    "deviceNamePlaceholder": "My device",
    "completionFeedback": "Sound / vibration on completion",
    "nearbyDiscovery": "Make this Send room discoverable nearby for 5 minutes",
    "nearbyCode": "Nearby code: %code%",
    "scanQr": "Scan QR",
    "findNearby": "Find nearby",
    "scannerHelp": "Point the camera at a BlinkSend QR code.",
    "scannerUnsupported": "QR scanning is not supported in this browser. Use the phone camera app or paste the invite link.",
    "cameraDenied": "Camera access was not available.",
    "noNearby": "No discoverable BlinkSend rooms found on this network.",
    "history": "Transfer history",
    "clearHistory": "Clear",
    "noHistory": "No transfers yet.",
    "historyPrivate": "Stored only in this browser.",
    "recentDevices": "Recent devices",
    "noRecentDevices": "No recent devices.",
    "diagnostics": "Diagnostics",
    "showDiagnostics": "Show",
    "hideDiagnostics": "Hide",
    "diagConnection": "Connection",
    "diagTransport": "Transport",
    "diagRtt": "Round trip",
    "diagMeasured": "Measured speed",
    "diagChunk": "Chunk size",
    "diagBuffer": "Send buffer",
    "diagReconnects": "Reconnects",
    "diagCapabilities": "Browser support",
    "transferQueue": "Transfer queue",
    "clearQueue": "Clear pending",
    "queueSummary": "%count% pending · %size%",
    "queueLocked": "Folder batch is active — pending membership is locked.",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove",
    "transferDone": "Transfer verified",
    "sessionStillConnected": "The devices are still connected.",
    "sendAnother": "Send another",
    "reconnectBanner": "Connection lost — reconnecting without discarding progress…",
    "reverifyBanner": "Connection restored — compare the new verification code to resume.",
    "resumeBanner": "Resuming from %percent%%…",
    "retryBanner": "Verification failed — retrying this file (%attempt%/2)…",
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
    "speed": "%label% %bytes% of %total% · %speed%/s%eta%",
    "etaSuffix": " · ~%eta% left",
    "qualityExcellent": "Excellent",
    "qualityGood": "Good",
    "qualityFair": "Fair",
    "qualityPoor": "Poor",
    "qualityUnknown": "Measuring",
    "pathDirect": "Direct",
    "pathRelay": "Relay",
    "batchProgress": "Batch %bytes% of %total% · file %current%/%count%",
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
    "codePlaceholder": "ABCD-EFGH",
    "joinCode": "Använd kod",
    "pairCode": "Parkopplingskod",
    "pairCodeHelp": "Skriv koden på mottagarenheten. Den går ut efter 10 minuter.",
    "pairCodeUntil": "Giltig till %time%. Den sexsiffriga verifieringskontrollen krävs fortfarande.",
    "invalidCode": "Parkopplingskoden är ogiltig eller har gått ut.",
    "serverRestarting": "Servern startar om — återansluter…",
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
    "install": "Installera",
    "sharedReady": "Delade objekt är redo. Anslut mottagarenheten för att skicka dem.",
    "settings": "Inställningar",
    "close": "Stäng",
    "deviceName": "Enhetsnamn",
    "deviceNamePlaceholder": "Min enhet",
    "completionFeedback": "Ljud / vibration när överföringen är klar",
    "nearbyDiscovery": "Gör det här Skicka-rummet synligt i närheten i 5 minuter",
    "nearbyCode": "Kod i närheten: %code%",
    "scanQr": "Skanna QR",
    "findNearby": "Hitta i närheten",
    "scannerHelp": "Rikta kameran mot en BlinkSend-QR-kod.",
    "scannerUnsupported": "QR-skanning stöds inte i den här webbläsaren. Använd mobilens kameraapp eller klistra in länken.",
    "cameraDenied": "Kameran kunde inte användas.",
    "noNearby": "Inga synliga BlinkSend-rum hittades på det här nätverket.",
    "history": "Överföringshistorik",
    "clearHistory": "Rensa",
    "noHistory": "Inga överföringar än.",
    "historyPrivate": "Sparas bara i den här webbläsaren.",
    "recentDevices": "Senaste enheter",
    "noRecentDevices": "Inga senaste enheter.",
    "diagnostics": "Diagnostik",
    "showDiagnostics": "Visa",
    "hideDiagnostics": "Dölj",
    "diagConnection": "Anslutning",
    "diagTransport": "Transport",
    "diagRtt": "Tur och retur",
    "diagMeasured": "Uppmätt hastighet",
    "diagChunk": "Chunkstorlek",
    "diagBuffer": "Sändbuffert",
    "diagReconnects": "Återanslutningar",
    "diagCapabilities": "Webbläsarstöd",
    "transferQueue": "Överföringskö",
    "clearQueue": "Rensa väntande",
    "queueSummary": "%count% väntar · %size%",
    "queueLocked": "Mappbatchen är aktiv — väntande filer är låsta.",
    "moveUp": "Flytta upp",
    "moveDown": "Flytta ned",
    "remove": "Ta bort",
    "transferDone": "Överföringen verifierad",
    "sessionStillConnected": "Enheterna är fortfarande anslutna.",
    "sendAnother": "Skicka en till",
    "reconnectBanner": "Anslutningen bröts — återansluter utan att kasta framsteg…",
    "reverifyBanner": "Anslutningen är tillbaka — jämför den nya verifieringskoden för att fortsätta.",
    "resumeBanner": "Fortsätter från %percent%%…",
    "retryBanner": "Verifieringen misslyckades — försöker filen igen (%attempt%/2)…",
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
    "speed": "%label% %bytes% av %total% · %speed%/s%eta%",
    "etaSuffix": " · ~%eta% kvar",
    "qualityExcellent": "Utmärkt",
    "qualityGood": "Bra",
    "qualityFair": "Okej",
    "qualityPoor": "Svag",
    "qualityUnknown": "Mäter",
    "pathDirect": "Direkt",
    "pathRelay": "Relä",
    "batchProgress": "Batch %bytes% av %total% · fil %current%/%count%",
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
  Object.assign(translations, window.BlinkLocalePacks || {});
  const localeMeta = window.BlinkLocaleMeta || { names: { en: 'English', sv: 'Svenska' }, titles: {}, resolve: () => 'en' };
  const readSetting = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const saveSetting = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing may disable storage. */ } };
  const storedLanguage = readSetting('blinksend-language');
  const browserLocales = [...(navigator.languages || []), navigator.language, Intl.DateTimeFormat?.().resolvedOptions?.().locale].filter(Boolean);
  let language = storedLanguage && translations[storedLanguage] ? storedLanguage : localeMeta.resolve(browserLocales);
  if (!translations[language]) language = 'en';
  const languageSelect = $('language');
  const languageCodes = Object.keys(localeMeta.names || {}).filter(code => translations[code]);
  languageSelect.replaceChildren(...languageCodes.map(code => {
    const option = document.createElement('option'); option.value = code; option.textContent = localeMeta.names[code] || code; return option;
  }));
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let theme = readSetting('blinksend-theme') || (systemTheme.matches ? 'dark' : 'light');
  if (!['dark', 'light'].includes(theme)) theme = 'light';
  const tr = (key, vars = {}) => (translations[language][key] || translations.en[key] || key).replace(/%([a-z]+)%/g, (_, name) => String(vars[name] ?? ''));
  let lastStatus = { key: 'connectingRoom', ready: false, vars: {} }, lastNotice = { key: '', vars: {} }, progressState, copyTimer, lastProgressRenderAt=0;
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#171d20' : '#f6f7f8';
    const toggle = $('theme-toggle');
    toggle.textContent = tr(theme === 'dark' ? 'light' : 'dark');
    toggle.title = toggle.ariaLabel = tr(theme === 'dark' ? 'switchLight' : 'switchDark');
  }
  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = localeMeta.titles?.[language] || 'BlinkSend — File transfer';
    languageSelect.value = language;
    languageSelect.ariaLabel = tr('language');
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
  languageSelect.onchange = e => { language = translations[e.target.value] ? e.target.value : 'en'; saveSetting('blinksend-language', language); applyLanguage(); };
  $('theme-toggle').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; saveSetting('blinksend-theme', theme); applyTheme(); };
  systemTheme.addEventListener?.('change', e => { if (!readSetting('blinksend-theme')) { theme = e.matches ? 'dark' : 'light'; applyTheme(); } });
  function updateSaveNote() {
    els['save-note'].textContent = tr(!window.showSaveFilePicker && !supportsOpfs && pending.size > maxMemoryFile ? 'largeUnsupported' : 'saveNote');
  }
  function renderTransfer() {
    els['queue-status'].textContent = tr('queue', { current: batchDone + 1, total: batchTotal, remaining: outgoing.length });
    els.cancel.textContent = tr(batchTotal > 1 && active?.direction === 'send' ? 'cancelBatch' : 'cancel');
    if (progressState) {
      const { bytes, total, label, speed=0, etaSeconds=Infinity } = progressState;
      const eta=Number.isFinite(etaSeconds)&&etaSeconds>=1?tr('etaSuffix',{eta:BlinkProtocol.formatEta(etaSeconds)}):'';
      els['progress-text'].textContent = tr('speed', { label: tr(label), bytes: format(bytes), total: format(total), speed: format(speed), eta });
    } else els['progress-text'].textContent = tr(active?.stage || 'starting');
    const batch=active?.direction==='send'?outgoingBatch:incomingBatch;
    if(batch&&batch.totalSize){
      const currentBytes=(batch.completedBytes||0)+(progressState?.bytes||0);
      els['batch-summary'].hidden=false;
      els['batch-summary'].textContent=tr('batchProgress',{bytes:format(Math.min(batch.totalSize,currentBytes)),total:format(batch.totalSize),current:(batch.completedCount||0)+1,count:batch.count||batchTotal||1});
    } else els['batch-summary'].hidden=true;
  }
  const defaultChunkSize = 64 * 1024;
  const maxMemoryFile = 200 * 1024 * 1024;
  let tuning=BlinkProtocol.chooseTuning({deviceMemory:navigator.deviceMemory||0,cores:navigator.hardwareConcurrency||4});
  let connectionMetrics={rttMs:0,throughputBps:0,relayed:false,localType:'',remoteType:''};
  let benchmarkState=null, benchmarkIncoming='', incomingText=null, reconnectCount=0, diagnosticsTimer=0;
  const maxTextBytes = BlinkSecurity.LIMITS.textBytes;
  const supportsOpfs = !!navigator.storage?.getDirectory;
  async function createOpfsWorkerBridge(handle,{truncate=false,resumeBytes=0}={}){
    if(!supportsOpfs||!window.Worker)return null;
    const worker=new Worker('/receive-worker.js');
    let sequence=0,closed=false;
    const pendingCalls=new Map();
    let readyResolve,readyReject;
    const ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
    const failAll=error=>{for(const {reject} of pendingCalls.values())reject(error);pendingCalls.clear();readyReject?.(error);};
    worker.onmessage=event=>{
      const msg=event.data||{};
      if(msg.type==='ready'){readyResolve?.(msg);readyResolve=readyReject=null;return;}
      if(msg.type==='error'){
        const error=new Error(msg.message||'OPFS worker failed');
        if(msg.id&&pendingCalls.has(msg.id)){pendingCalls.get(msg.id).reject(error);pendingCalls.delete(msg.id);}
        else failAll(error);
        return;
      }
      if(msg.id&&pendingCalls.has(msg.id)){pendingCalls.get(msg.id).resolve(msg);pendingCalls.delete(msg.id);}
    };
    worker.onerror=event=>failAll(new Error(event.message||'OPFS worker failed'));
    worker.postMessage({type:'init',handle,truncate,resumeBytes});
    try{await ready;}catch(error){worker.terminate();throw error;}
    return {
      call(type,payload={},transfer=[]){
        if(closed)return Promise.reject(new Error('OPFS worker is closed'));
        const id=String(++sequence);
        return new Promise((resolve,reject)=>{pendingCalls.set(id,{resolve,reject});worker.postMessage({type,id,...payload},transfer);});
      },
      terminate(){if(closed)return;closed=true;worker.terminate();failAll(new Error('OPFS worker terminated'));}
    };
  }
  function createSenderHashTask(file){
    if(!window.Worker)return null;
    const worker=new Worker('/hash-worker.js');
    const id=crypto.randomUUID();
    let settled=false,rejectDone;
    const promise=new Promise((resolve,reject)=>{
      rejectDone=reject;
      worker.onmessage=event=>{
        const msg=event.data||{};
        if(msg.id!==id)return;
        if(msg.type==='done'){
          if(settled)return;settled=true;resolve(msg.sha256);worker.terminate();
        }else if(msg.type==='error'){
          if(settled)return;settled=true;reject(new Error(msg.message||'Hash worker failed'));worker.terminate();
        }
      };
      worker.onerror=event=>{if(settled)return;settled=true;reject(new Error(event.message||'Hash worker failed'));worker.terminate();};
      worker.postMessage({type:'hash',id,file,chunkBytes:16*1024*1024});
    });
    return {
      promise,
      terminate(){
        if(settled)return;settled=true;
        try{worker.postMessage({type:'cancel',id});}catch{}
        worker.terminate();
        rejectDone?.(new Error('Hash cancelled'));
      }
    };
  }
  function ensureSenderHash(state=active){
    if(!state||state.direction!=='send'||!state.file)return Promise.reject(new Error('No sender file'));
    if(state.fullHash)return Promise.resolve(state.fullHash);
    if(!state.hashPromise){
      const task=createSenderHashTask(state.file);
      if(task){
        state.hashTask=task;
        state.hashPromise=task.promise.then(hash=>{state.fullHash=hash;return hash;}).finally(()=>{if(state.hashTask===task)state.hashTask=null;});
        state.hashPromise.catch(()=>{});
      }else{
        state.hashPromise=BlinkTransfer.hashWholeFile(state.file,state.chunkSize||defaultChunkSize).then(hash=>{state.fullHash=hash;return hash;});
      }
    }
    return state.hashPromise;
  }
  function isLikelyLan(){
    return !connectionMetrics.relayed&&connectionMetrics.rttMs>0&&connectionMetrics.rttMs<25&&
      connectionMetrics.localType==='host'&&connectionMetrics.remoteType==='host';
  }
  function retuneConnection(){
    tuning=BlinkProtocol.chooseTuning({
      throughputBps:connectionMetrics.throughputBps,
      rttMs:connectionMetrics.rttMs,
      deviceMemory:navigator.deviceMemory||0,
      cores:navigator.hardwareConcurrency||4,
      maxMessageSize:pc?.sctp?.maxMessageSize||0,
      lan:isLikelyLan()
    });
    if(channel?.readyState==='open')channel.bufferedAmountLowThreshold=tuning.lowWater;
    return tuning;
  }
  const format = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;
  let socket, pc, channel, pending, active, incomingQueue = Promise.resolve(), signalQueue = Promise.resolve(), connectTimer, iceToken = '', isOfferer=false, iceRestartTimer;
  let readyLabel = 'ready', peerVerified = false, localVerified = false, remoteVerified = false, verificationCode = '', calibrating=false;
  let outgoing = [], batchTotal = 0, batchDone = 0, mode = '', outgoingBatch = null, incomingBatch = null, resumeSession = null, peerName = '', lastReceivedFile = null, pendingSharedTarget=null, installPrompt=null;
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
  function openShareDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open('blinksend-share',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('inbox'))req.result.createObjectStore('inbox',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function consumeShareTarget(){
    if(!new URLSearchParams(location.search).has('share'))return null;
    try{const db=await openShareDb();return await new Promise((resolve,reject)=>{const tx=db.transaction('inbox','readwrite'),store=tx.objectStore('inbox'),req=store.get('pending');req.onsuccess=()=>{const value=req.result||null;store.delete('pending');resolve(value);};req.onerror=()=>reject(req.error);});}catch{return null;}
  }
  async function flushSharedTarget(){
    if(!pendingSharedTarget||!peerVerified||channel?.readyState!=='open')return;
    const item=pendingSharedTarget;pendingSharedTarget=null;
    if(item.files?.length){enqueueEntries(item.files.map(file=>({file,relativePath:file.webkitRelativePath||''})));return;}
    const text=[item.title,item.text,item.url].filter(Boolean).join('\n').trim();if(text)await sendTextValue(text);
  }
  const sanitizeDeviceName = value => String(value || '').replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,BlinkSecurity.LIMITS.deviceNameChars);
  let deviceName = sanitizeDeviceName(readSetting('blinksend-device-name')) || 'BlinkSend device';
  let completionFeedback = readSetting('blinksend-completion-feedback') === '1';
  let nearbyDiscovery = readSetting('blinksend-nearby') === '1', scannerStream=null, scannerLoop=0;
  function recentPeerNames(){try{return JSON.parse(readSetting('blinksend-recent-peers')||'[]').filter(x=>typeof x==='string').slice(0,6);}catch{return [];}}
  function rememberPeerName(name){name=sanitizeDeviceName(name);if(!name)return;const names=[name,...recentPeerNames().filter(x=>x!==name)].slice(0,6);saveSetting('blinksend-recent-peers',JSON.stringify(names));renderRecentPeers();}
  function renderRecentPeers(){const names=recentPeerNames();els['recent-peers'].innerHTML='';if(!names.length){const span=document.createElement('span');span.className='hint';span.textContent=tr('noRecentDevices');els['recent-peers'].append(span);return;}for(const name of names){const span=document.createElement('span');span.className='recent-peer';span.textContent=name;els['recent-peers'].append(span);}}
  function setTransferBanner(text='',state=''){if(!text){els['transfer-state-banner'].hidden=true;els['transfer-state-banner'].textContent='';els['transfer-state-banner'].removeAttribute('data-state');return;}els['transfer-state-banner'].hidden=false;els['transfer-state-banner'].dataset.state=state;els['transfer-state-banner'].textContent=text;}
  function updateDiagnostics(){const direct=connectionMetrics.relayed?tr('pathRelay'):tr('pathDirect');els['diag-connection'].textContent=pc?.connectionState||'—';els['diag-transport'].textContent=channel?.readyState==='open'?`${direct}${connectionMetrics.localType||connectionMetrics.remoteType?` · ${connectionMetrics.localType||'?'}→${connectionMetrics.remoteType||'?'}`:''}`:'—';els['diag-rtt'].textContent=connectionMetrics.rttMs?`${connectionMetrics.rttMs} ms`:'—';els['diag-measured'].textContent=connectionMetrics.throughputBps?`${format(connectionMetrics.throughputBps)}/s`:'—';els['diag-chunk'].textContent=format(active?.chunkSize||tuning.chunkSize);els['diag-buffer'].textContent=format(active?.highWater||tuning.highWater);els['diag-reconnects'].textContent=String(reconnectCount);els['diag-capabilities'].textContent=[window.showOpenFilePicker?'File picker':'Downloads',window.showDirectoryPicker?'Folders':'Folder fallback',supportsOpfs?'OPFS fast path':'No OPFS','serviceWorker' in navigator?'PWA':'No PWA',navigator.share?'Share':'No Share'].join(' · ');}
  function renderQueue(){const locked=!!outgoingBatch,count=outgoing.length,total=outgoing.reduce((n,e)=>n+(e.file?.size||e.size||0),0);els['queue-panel'].hidden=!count;els['queue-summary'].textContent=count?tr('queueSummary',{count,size:format(total)}):'';els['clear-queue'].disabled=locked||!count;els['clear-queue'].title=locked?tr('queueLocked'):'';els['queue-list'].innerHTML='';outgoing.forEach((entry,index)=>{const row=document.createElement('div');row.className='queue-item';const main=document.createElement('div');main.className='queue-item-main';const name=document.createElement('span');name.className='queue-item-name';name.textContent=entry.relativePath||entry.file?.name||entry.name||'File';const size=document.createElement('span');size.className='queue-item-size';size.textContent=format(entry.file?.size||entry.size||0);main.append(name,size);const actions=document.createElement('div');actions.className='queue-item-actions';for(const [symbol,title,delta] of [['↑',tr('moveUp'),-1],['↓',tr('moveDown'),1]]){const b=document.createElement('button');b.type='button';b.className='queue-icon-button';b.textContent=symbol;b.title=title;b.disabled=(delta<0&&index===0)||(delta>0&&index===outgoing.length-1);b.onclick=()=>{const next=index+delta;[outgoing[index],outgoing[next]]=[outgoing[next],outgoing[index]];renderQueue();};actions.append(b);}const remove=document.createElement('button');remove.type='button';remove.className='queue-icon-button';remove.textContent='×';remove.title=tr('remove');remove.disabled=locked;remove.onclick=()=>{outgoing.splice(index,1);batchTotal=Math.max(batchDone+(active?1:0)+outgoing.length,active?1:0);renderQueue();renderTransfer();};actions.append(remove);row.append(main,actions);els['queue-list'].append(row);});}
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
        const detail=document.createElement('span');detail.textContent=`${item.direction==='send'?'Sent':'Received'}${item.peer?` · ${item.peer}`:''} · ${item.verified?'SHA-256 verified':'Completed'}`;
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
    const unlocked = ready && peerVerified && !calibrating && mode === 'send';
    els.file.disabled = !unlocked || !!pending || !!outgoingBatch;
    els.folder.disabled = !unlocked || !!pending || !!active || !!outgoingBatch;
    els['choose-folder'].disabled = els.folder.disabled;
    els['share-text'].disabled = !unlocked;
    els['send-text'].disabled = !unlocked;
    els.drop.classList.toggle('disabled', els.file.disabled);
  }
  function notice(key = '', vars = {}) { lastNotice = { key, vars }; els.notice.textContent = key ? tr(key, vars) : ''; }
  function signal(type, payload) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload })); }
  function pauseTransfer() {
    if (!active) return;
    active.flowWake?.();
    active.paused = true; active.stage = 'paused'; progressState = null; setTransferBanner(tr('reconnectBanner'),'warning'); renderTransfer();
  }
  function resetPeer() {
    clearTimeout(connectTimer);
    pauseTransfer();
    pending = null; els.incoming.hidden = true;
    peerVerified = false; localVerified = false; remoteVerified = false; verificationCode = ''; els['verify-peer'].hidden = true;
    channel?.close(); pc?.close(); channel = null; pc = null;
    status('waiting');
  }
  async function showVerificationCode() {
    const display=await BlinkVerification.deriveCode(pc?.localDescription,pc?.remoteDescription);
    if(!display)return;if(display===verificationCode&&peerVerified)return;
    verificationCode=display;els['verify-code'].textContent=display;els['verify-match'].disabled=false;
    els['verify-peer'].hidden=false;peerVerified=false;localVerified=false;remoteVerified=false;status('verifyStatus',false);
  }
  async function connectionPath() {
    const current = pc;
    try {
      const stats = await current.getStats();
      if (pc !== current || channel?.readyState !== 'open') return;
      const summary=BlinkConnection.summarize(stats);
      connectionMetrics.relayed=summary.relayed;connectionMetrics.rttMs=summary.rttMs;connectionMetrics.localType=summary.localType;connectionMetrics.remoteType=summary.remoteType;
      retuneConnection();
      readyLabel=!summary.pair?'ready':summary.relayed?'readyRelay':'readyDirect';updateQualityLabel();updateDiagnostics();
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
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { pauseTransfer(); status(active ? 'paused' : 'interrupted'); if(isOfferer)scheduleIceRestart(); }
    };
    pc.ondatachannel = e => setupChannel(e.channel);
  }
  function scheduleIceRestart(){
    clearTimeout(iceRestartTimer);reconnectCount++;updateDiagnostics();iceRestartTimer=setTimeout(async()=>{
      if(!isOfferer||!pc||socket?.readyState!==WebSocket.OPEN)return;
      try{pc.restartIce?.();await pc.setLocalDescription(await pc.createOffer({iceRestart:true}));signal('offer',pc.localDescription.toJSON());status('reconnecting');}catch{}
    },600);
  }
  window.addEventListener('online',scheduleIceRestart);
  navigator.connection?.addEventListener?.('change',scheduleIceRestart);
  function setupChannel(ch) {
    channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.bufferedAmountLowThreshold = tuning.lowWater;
    ch.onopen = () => {
      clearTimeout(connectTimer); connectionPath(); notice();
      ch.send(JSON.stringify({type:'hello',name:deviceName}));
      if (active) { active.paused = true; active.stage = 'resuming'; setTransferBanner(tr('reverifyBanner'),'warning'); renderTransfer(); }
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
        if (msg.type === 'joined') { iceToken = typeof msg.iceToken === 'string' ? msg.iceToken : ''; const rawCode=typeof msg.pairCode==='string'?msg.pairCode.replace(/[^A-Z0-9]/g,'').slice(0,8):'';if(mode==='send'&&rawCode){els['pair-code'].textContent=rawCode.slice(0,4)+'-'+rawCode.slice(4);const expires=Number(msg.pairCodeExpires);if(Number.isFinite(expires)&&expires>Date.now())els['pair-code-help'].textContent=tr('pairCodeUntil',{time:new Date(expires).toLocaleTimeString(language==='sv'?'sv-SE':undefined,{hour:'2-digit',minute:'2-digit'})});els['pair-code-wrap'].hidden=false;} status(msg.count === 1 ? 'waiting' : 'connecting'); if(mode==='send'&&nearbyDiscovery)registerNearby(); }
        if (msg.type === 'server-restart') { pauseTransfer();status('serverRestarting'); }
        if (msg.type === 'full') { status('roomFull'); notice('roomFullHelp'); }
        if (msg.type === 'peer-left') resetPeer();
        if (msg.type === 'peer-joined') { isOfferer=true; await makePeer(); setupChannel(pc.createDataChannel('files', { ordered: true })); await pc.setLocalDescription(await pc.createOffer()); signal('offer', pc.localDescription.toJSON()); status('connecting'); }
        if (msg.type === 'offer') { isOfferer=false; if(!pc||pc.connectionState==='closed')await makePeer(); await pc.setRemoteDescription(msg.payload); await pc.setLocalDescription(await pc.createAnswer()); signal('answer', pc.localDescription.toJSON()); status('connecting'); }
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
    els.progress.value = 0; active.stage = 'starting'; progressState = null; lastProgressRenderAt=0;
    els.file.disabled = true; els.drop.classList.add('disabled');
    els['queue-status'].hidden = batchTotal < 2 || active?.direction !== 'send';
    renderTransfer();
  }
  function progress(bytes,total,started,label){
    const now=performance.now();
    els.progress.value=total?Math.min(100,bytes/total*100):100;
    progressState=BlinkProtocol.updateTransferEstimate(progressState,{bytes,total,started,label,now});
    if(!lastProgressRenderAt||now-lastProgressRenderAt>=(tuning.uiIntervalMs||100)||bytes>=total){
      lastProgressRenderAt=now;renderTransfer();
    }
  }
  function stopTransfer(message, notify = true, preserveQueue = false, vars = {}) {
    active?.flowWake?.();
    active?.hashTask?.terminate?.();
    active?.opfsWorker?.terminate?.();
    if (notify && active && channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'cancel', id: active.id }));
    if (active?.writer) active.writer.abort().catch(() => {});
    if (active?.opfs) active.opfs.root.removeEntry(active.opfs.tempName).catch(() => {});
    active = null; progressState = null;
    if (!preserveQueue) { outgoing = []; batchTotal = 0; batchDone = 0; outgoingBatch=null; renderQueue(); }
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
    try { await BlinkStore.put({ id:sessionKey(), room, role:'send', transferId:active.id, handle:entry.handle, name:active.file.name, size:active.file.size, lastModified:active.file.lastModified, relativePath:active.relativePath, chunkSize:active.chunkSize, batchId:outgoingBatch?.id || null, batchName:outgoingBatch?.name || null, batchEntries, batchDone }); } catch {}
  }
  async function persistReceiveSession() {
    if (!window.BlinkStore || !active?.persistentHandle || !room) return;
    try { await BlinkStore.put({ id:sessionKey(), room, role:'receive', transferId:active.id, handle:active.persistentHandle, name:active.name, size:active.size, relativePath:active.relativePath, chunkSize:active.chunkSize, received:active.committedBytes || 0, receivedMap:active.receivedMap, nextChunk:active.nextChunk||0, batchId:incomingBatch?.id || null, batchName:incomingBatch?.name || null, batchRootHandle:incomingBatch?.rootHandle || null, opfs:!!active.opfs, opfsTempName:active.opfs?.tempName || null }); } catch {}
  }
  async function persistBatchContext() {
    if (!window.BlinkStore || !room || !incomingBatch?.rootHandle) return;
    try { await BlinkStore.put({ id:`batch:${room}`, room, role:'receive-batch', batchId:incomingBatch.id, batchName:incomingBatch.name, batchRootHandle:incomingBatch.rootHandle }); } catch {}
  }
  async function clearPersistent() { if (window.BlinkStore && room) { try { await BlinkStore.remove(sessionKey()); } catch {} } }
  async function clearBatchContext() { if (window.BlinkStore && room) { try { await BlinkStore.remove(`batch:${room}`); } catch {} } }
  async function rebuildReceiveHasher(handle, bytes) {
    const file = await handle.getFile(); return BlinkTransfer.hashPrefix(file, Math.min(bytes, file.size));
  }
  function updateQualityLabel(){
    const q=BlinkProtocol.connectionQuality(connectionMetrics);
    const key=q==='excellent'?'qualityExcellent':q==='good'?'qualityGood':q==='fair'?'qualityFair':q==='poor'?'qualityPoor':'qualityUnknown';
    const path=connectionMetrics.relayed?tr('pathRelay'):tr('pathDirect');
    const measured=connectionMetrics.throughputBps?' · '+format(connectionMetrics.throughputBps)+'/s':'';
    els['connection-quality'].textContent=path+' · '+tr(key)+measured;
  }
  async function runBenchmark(){
    if(channel?.readyState!=='open'||active||benchmarkState||mode!=='send')return;
    const id=crypto.randomUUID(),bytes=8*1024*1024;
    benchmarkState={id,bytes,started:0,resolve:null};
    const done=new Promise(resolve=>benchmarkState.resolve=resolve);
    channel.send(JSON.stringify({type:'benchmark-start',id,bytes}));
    const timeout=setTimeout(()=>benchmarkState?.resolve?.(0),12000);
    const throughput=await done;clearTimeout(timeout);
    if(throughput>0)connectionMetrics.throughputBps=throughput;
    retuneConnection();
    benchmarkState=null;updateQualityLabel();updateDiagnostics();
  }
  async function sendBenchmarkPayload(){
    if(!benchmarkState||channel?.readyState!=='open')return;
    benchmarkState.started=performance.now();
    const block=new Uint8Array(64*1024),count=Math.ceil(benchmarkState.bytes/block.byteLength);
    for(let i=0;i<count;i++){
      while(channel.bufferedAmount>8*1024*1024)await new Promise(r=>channel.addEventListener('bufferedamountlow',r,{once:true}));
      channel.send(block);
    }
    channel.send(JSON.stringify({type:'benchmark-end',id:benchmarkState.id,bytes:benchmarkState.bytes}));
  }
  function maybeFinishVerification() {
    if(!localVerified||!remoteVerified||peerVerified)return;
    peerVerified=true;els['verify-peer'].hidden=true;
    if(active){status('verified',true);if(active.direction==='receive'&&active.paused&&channel?.readyState==='open')sendResumeMap();if(active.direction==='send'&&active.pendingRanges){const ranges=active.pendingRanges;delete active.pendingRanges;resumeOutgoingRanges(ranges);}else if(active.direction==='send'&&Number.isSafeInteger(active.pendingResume)){const next=active.pendingResume;delete active.pendingResume;resumeOutgoing(next);}return;}
    if(mode==='send'){
      calibrating=true;status('verified',true);
      runBenchmark().catch(()=>{}).finally(()=>{calibrating=false;status('verified',true);flushSharedTarget();});
    }else{
      calibrating=false;status('verified',true);flushSharedTarget();
    }
  }
  function sendResumeMap(){
    if(!active||active.direction!=='receive'||channel?.readyState!=='open')return;
    sendFlowUpdate(active,true);
    const total=Math.ceil(active.size/(active.chunkSize||defaultChunkSize));
    const ranges=BlinkProtocol.missingRanges(active.receivedMap||new Uint8Array(Math.ceil(total/8)),total);
    channel.send(JSON.stringify({type:'resume-map',id:active.id,ranges,size:active.size,chunkSize:active.chunkSize||defaultChunkSize}));
  }
  async function hashReceivedActive(state){
    if(state.persistentHandle)return BlinkTransfer.hashWholeFile(await state.persistentHandle.getFile(),state.chunkSize);
    if(state.opfs?.handle)return BlinkTransfer.hashWholeFile(await state.opfs.handle.getFile(),state.chunkSize);
    const h=new BlinkSHA256();for(const part of state.chunks||[]){if(part)h.update(part);}return h.hex();
  }
  async function resumeOutgoingRanges(ranges){
    if(!active||active.direction!=='send')return;
    const size=active.chunkSize||defaultChunkSize,total=Math.ceil(active.file.size/size);
    if(!BlinkSecurity.validRanges(ranges,total))return;
    active.fullHash=await BlinkTransfer.hashWholeFile(active.file,size);active.hasher=null;active.sendRanges=ranges.map(r=>[r[0],r[1]]);active.rangeIndex=0;active.rangeSeq=active.sendRanges[0]?.[0]??total;
    let missing=0;for(const [s,e] of active.sendRanges){const start=s*size,end=Math.min(active.file.size,(e+1)*size);missing+=Math.max(0,end-start);}
    active.sent=Math.max(0,active.file.size-missing);active.remoteReceived=Math.max(active.remoteReceived||0,active.sent);active.remoteWindow=active.remoteWindow||8*1024*1024;active.paused=false;active.stage='resuming';setTransferBanner(tr('resumeBanner',{percent:Math.floor((active.sent/Math.max(1,active.file.size))*100)}),'ok');progress(active.sent,active.file.size,active.started,'sending');pump(active.id);
  }
  async function resumeOutgoing(nextChunk) {
    if (!active || active.direction !== 'send' || !Number.isSafeInteger(nextChunk) || nextChunk < 0) return;
    const size=active.chunkSize||defaultChunkSize; const offset = Math.min(active.file.size, nextChunk * size); active.sent = offset; active.remoteReceived=Math.max(active.remoteReceived||0,offset);active.remoteWindow=active.remoteWindow||8*1024*1024; active.nextChunk = nextChunk;
    active.hasher = await BlinkTransfer.hashPrefix(active.file, offset, size); active.fullHash=''; active.sendRanges=null; active.paused = false; active.stage = 'resuming';setTransferBanner(tr('resumeBanner',{percent:Math.floor((offset/Math.max(1,active.file.size))*100)}),'ok');
    progress(offset, active.file.size, active.started, 'sending'); pump(active.id);
  }
  async function sendFile(entry) {
    if (!entry || channel?.readyState !== 'open' || active || pending) return;
    const file = entry.file || entry;
    const relativePath = entry.relativePath || file.webkitRelativePath || '';
    retuneConnection();
    const id = entry.transferId || crypto.randomUUID(); active = { id, direction: 'send', file, sourceEntry:entry, relativePath, batchId:outgoingBatch?.id || entry.batchId || null, chunkSize:tuning.chunkSize, highWater:tuning.highWater, sent: 0, nextChunk: 0, remoteReceived:0, remoteWindow:0, flowWake:null, hasher:null, fullHash:'', hashTask:null, hashPromise:null, started: Date.now(), accepted: false, paused: false };
    showTransfer(relativePath || file.name, file.size);
    await persistSendSession(entry);
    channel.send(JSON.stringify({ type: 'request', id, name: file.name, relativePath, size: file.size, batchId:active.batchId, chunkSize:active.chunkSize }));
    active.stage = 'waitingAcceptance'; renderTransfer();
  }
  function sendNext() {
    if (active || pending || channel?.readyState !== 'open') return;
    const file=outgoing.shift();renderQueue();
    if(file){notice();sendFile(file);}else{batchTotal=0;batchDone=0;renderQueue();}
  }
  function finishOutgoing(message, vars = {}) {
    const finishedSize=active?.file?.size||0;if(outgoingBatch){outgoingBatch.completedBytes=(outgoingBatch.completedBytes||0)+finishedSize;outgoingBatch.completedCount=(outgoingBatch.completedCount||0)+1;}
    stopTransfer(message,false,true,vars);batchDone++;
    if(outgoing.length)setTimeout(sendNext,0);
    else{if(outgoingBatch?.id&&channel?.readyState==='open')channel.send(JSON.stringify({type:'batch-complete',id:outgoingBatch.id}));batchTotal=0;batchDone=0;outgoingBatch=null;clearPersistent();renderQueue();els['post-transfer'].hidden=false;}
  }
  function enqueueEntries(entries,folderName=''){
    if(!entries?.length||channel?.readyState!=='open'||pending||outgoingBatch)return;if(entries.length+outgoing.length>BlinkSecurity.LIMITS.queueFiles){notice('transferFailed');return;}
    const normalized=entries.map(entry=>entry.file?entry:({file:entry,relativePath:entry.webkitRelativePath||''})),isFolder=!!folderName||normalized.some(x=>x.relativePath);
    const totalLocal=normalized.reduce((sum,x)=>sum+(x.file?.size||0),0);if(normalized.some(x=>!x.file||x.file.size>BlinkSecurity.LIMITS.fileBytes||BlinkSecurity.safeRelativePath(x.relativePath)===null)||totalLocal>BlinkSecurity.LIMITS.batchBytes){notice('transferFailed');return;}
    if(isFolder&&active){notice('finishFirst');return;}
    if(isFolder){outgoing=[...normalized];batchTotal=outgoing.length;batchDone=0;const id=crypto.randomUUID(),name=folderName||outgoing[0].relativePath.split('/')[0]||'Folder',totalSize=outgoing.reduce((sum,x)=>sum+x.file.size,0);outgoingBatch={id,name,entries:[...outgoing],totalSize,count:outgoing.length,completedBytes:0,completedCount:0};renderQueue();channel.send(JSON.stringify({type:'batch-request',id,name,count:outgoing.length,totalSize}));return;}
    outgoing.push(...normalized);batchTotal=batchDone+(active?1:0)+outgoing.length;renderQueue();if(!active)sendNext();
  }
  function enqueueFiles(files) { enqueueEntries([...files].map(file => ({ file, relativePath:file.webkitRelativePath || '' }))); }
  async function waitForSendCapacity(limit,nextBytes=0){
    while(channel?.readyState==='open'){
      const bufferBlocked=channel.bufferedAmount>limit;
      const flowBlocked=active?.direction==='send'&&active.accepted&&active.remoteWindow>0&&
        (active.sent-(active.remoteReceived||0)+Math.max(0,nextBytes))>active.remoteWindow;
      if(!bufferBlocked&&!flowBlocked)break;
      await new Promise(resolve=>{
        let timer;
        const done=()=>{clearTimeout(timer);channel?.removeEventListener?.('bufferedamountlow',done);if(active?.flowWake===done)active.flowWake=null;resolve();};
        channel.addEventListener('bufferedamountlow',done,{once:true});
        if(active?.direction==='send')active.flowWake=done;
        timer=setTimeout(done,100);
      });
    }
    if(channel?.readyState!=='open')throw new Error('Connection closed');
  }
  function sendFlowUpdate(state=active,force=false){
    if(!state||state.direction!=='receive'||channel?.readyState!=='open')return;
    const windowBytes=state.flowWindow||tuning.receiveWindow||16*1024*1024;
    const ackBytes=tuning.flowAckBytes||2*1024*1024,now=performance.now();
    if(!force&&state.received-(state.lastFlowSent||0)<ackBytes&&now-(state.lastFlowAt||0)<500)return;
    state.lastFlowSent=state.received;state.lastFlowAt=now;
    channel.send(JSON.stringify({type:'flow',id:state.id,received:state.received,windowBytes}));
  }
  async function flushReceiveWrites(state=active){
    if(!state||( !state.writer && !state.opfsWorker )||!state.writeBuffer?.length)return;
    const entries=state.writeBuffer,start=state.writeBufferStart,total=state.writeBufferBytes;
    state.writeBuffer=[];state.writeBufferBytes=0;state.writeBufferStart=-1;
    if(state.opfsWorker){
      const merged=new Uint8Array(total);let cursor=0;
      for(const entry of entries){merged.set(entry.payload,cursor);cursor+=entry.payload.byteLength;}
      await state.opfsWorker.call('write',{offset:start,buffer:merged.buffer},[merged.buffer]);
      for(const entry of entries)BlinkTransfer.commitChunk(state,entry.seq,entry.payload.byteLength);
    }else{
      const merged=new Uint8Array(total);let cursor=0;
      for(const entry of entries){merged.set(entry.payload,cursor);cursor+=entry.payload.byteLength;}
      try{await state.writer.write({type:'write',position:start,data:merged});}
      catch{await state.writer.seek(start);await state.writer.write(merged);}
      let expectedSeq=state.nextChunk,sequential=!state.hashDirty;
      for(const entry of entries){if(entry.seq!==expectedSeq){sequential=false;break;}expectedSeq++;}
      if(sequential)state.hasher.update(merged);else state.hashDirty=true;
      for(const entry of entries)BlinkTransfer.commitChunk(state,entry.seq,entry.payload.byteLength);
    }
    if(state===active){progress(state.received,state.size,state.started,'receiving');sendFlowUpdate(state);}
    if(state===active&&state.persistentHandle&&state.received-(state.committedBytes||0)>=(tuning.checkpointBytes||128*1024*1024)){
      if(state.opfsWorker){
        await state.opfsWorker.call('flush');state.committedBytes=state.received;await persistReceiveSession();
      }else if(state.writer){
        await state.writer.close();state.committedBytes=state.received;await persistReceiveSession();state.writer=await state.persistentHandle.createWritable({keepExistingData:true});
      }
    }
  }
  async function pump(id) {
    try {
      const file=active?.file;if(!file||active.id!==id)return;
      const size=active.chunkSize||defaultChunkSize,readAhead=Math.max(size,tuning.readAhead||4*1024*1024);
      if(active.sendRanges){
        while(active?.id===id&&!active.paused&&active.rangeIndex<active.sendRanges.length){
          const range=active.sendRanges[active.rangeIndex];
          if(active.rangeSeq>range[1]){active.rangeIndex++;active.rangeSeq=active.sendRanges[active.rangeIndex]?.[0]??0;continue;}
          await waitForSendCapacity(active.highWater||tuning.highWater,0);
          const firstSeq=active.rangeSeq,rangeEndSeq=range[1]+1,maxSeq=Math.min(rangeEndSeq,firstSeq+Math.max(1,Math.floor(readAhead/size)));
          const start=firstSeq*size,end=Math.min(file.size,maxSeq*size),buffer=await file.slice(start,end).arrayBuffer(),view=new Uint8Array(buffer);
          let local=0,seq=firstSeq;
          while(local<view.byteLength&&seq<maxSeq){
            if(active?.id!==id||active.paused)return;
            const len=Math.min(size,view.byteLength-local);await waitForSendCapacity(active.highWater||tuning.highWater,len);
            const payload=view.subarray(local,local+len);
            channel.send(BlinkTransfer.packChunk(seq,payload));
            active.rangeSeq=++seq;active.sent=Math.min(file.size,active.sent+len);local+=len;
            progress(active.sent,file.size,active.started,'sending');
          }
        }
        if(active?.id===id&&!active.paused){channel.send(JSON.stringify({type:'complete',id,sha256:active.fullHash}));active.stage='finishing';progressState=null;renderTransfer();}return;
      }
      while(active?.id===id&&!active.paused&&active.sent<file.size){
        await waitForSendCapacity(active.highWater||tuning.highWater,0);
        const readStart=active.sent,readEnd=Math.min(file.size,readStart+readAhead),buffer=await file.slice(readStart,readEnd).arrayBuffer(),view=new Uint8Array(buffer);
        active.hasher.update(view);
        let local=0;
        while(local<view.byteLength){
          if(active?.id!==id||active.paused)return;
          const seq=active.nextChunk,len=Math.min(size,view.byteLength-local);await waitForSendCapacity(active.highWater||tuning.highWater,len);const payload=view.subarray(local,local+len);
          channel.send(BlinkTransfer.packChunk(seq,payload));
          active.sent+=len;active.nextChunk++;local+=len;
          progress(active.sent,file.size,active.started,'sending');
        }
      }
      if(active?.id===id&&!active.paused){channel.send(JSON.stringify({type:'complete',id,sha256:BlinkTransfer.finalHash(active)}));active.stage='finishing';progressState=null;renderTransfer();}
    } catch {if(active?.id===id){pauseTransfer();status('paused');}}
  }
  async function control(raw) {
    if(!BlinkSecurity.controlJsonWithinLimit(raw))return;
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if(!BlinkControlPolicy.allowed(msg?.type,peerVerified))return;
    if(msg.type==='benchmark-start'&&typeof msg.id==='string'){benchmarkIncoming=msg.id;channel.send(JSON.stringify({type:'benchmark-ready',id:msg.id}));return;}
    if(msg.type==='benchmark-ready'&&benchmarkState?.id===msg.id){sendBenchmarkPayload();return;}
    if(msg.type==='benchmark-end'&&benchmarkIncoming===msg.id){benchmarkIncoming='';channel.send(JSON.stringify({type:'benchmark-ack',id:msg.id,bytes:msg.bytes}));return;}
    if(msg.type==='benchmark-ack'&&benchmarkState?.id===msg.id&&benchmarkState.started){const seconds=Math.max(.001,(performance.now()-benchmarkState.started)/1000);benchmarkState.resolve?.((Number(msg.bytes)||benchmarkState.bytes)/seconds);return;}
    if (msg.type === 'hello') { peerName=sanitizeDeviceName(msg.name); els['peer-name'].textContent=peerName; rememberPeerName(peerName); updateDiagnostics(); return; }
    if (msg.type === 'batch-request') {
      if (active || pending || !BlinkSecurity.validBatchRequest(msg)) return;
      pending = { type:'batch', id:msg.id, name:BlinkSecurity.safeName(msg.name,'Folder'), count:msg.count, totalSize:msg.totalSize };
      els['incoming-title'].textContent = tr('incomingFolder');
      els['incoming-detail'].textContent = tr('folderPrompt', { name:pending.name, count:pending.count, size:format(pending.totalSize) });
      els['save-note'].textContent = window.showDirectoryPicker ? tr('saveFolder') : tr('folderUnsupported');
      els.accept.disabled = false; els.incoming.hidden = false; els.accept.focus(); status('incomingPrompt');
      return;
    }
    if (msg.type === 'batch-accept' && outgoingBatch?.id === msg.id) { sendNext(); return; }
    if (msg.type === 'batch-decline' && outgoingBatch?.id === msg.id) { outgoing=[]; outgoingBatch=null; batchTotal=0; batchDone=0; notice('declined'); return; }
    if (msg.type === 'batch-complete' && incomingBatch?.id === msg.id) { if(!BlinkSecurity.batchCompleteIsConsistent(incomingBatch)){notice('incomplete');return;} incomingBatch=null; await clearBatchContext(); return; }
    if (msg.type === 'request') {
      if (active || pending || !BlinkSecurity.validFileRequest(msg)) { channel.send(JSON.stringify({ type: 'decline', id: typeof msg.id==='string'?msg.id:'' })); return; }
      const safeName=BlinkSecurity.safeName(msg.name,'download');
      const safePath=BlinkSecurity.safeRelativePath(msg.relativePath);
      const requestedChunk=Number.isSafeInteger(msg.chunkSize)?msg.chunkSize:defaultChunkSize;
      pending = { id: msg.id, name: safeName, relativePath: safePath, size: msg.size, chunkSize:requestedChunk, batchId:typeof msg.batchId === 'string' ? msg.batchId : null };
      if(pending.batchId){if(incomingBatch?.id!==pending.batchId||!BlinkSecurity.batchAllowsFile(incomingBatch,pending)){channel.send(JSON.stringify({type:'decline',id:pending.id}));pending=null;return;}await acceptPendingFile(true);return;}
      els['incoming-title'].textContent = tr('incomingFile');
      els['incoming-detail'].textContent = `${pending.relativePath || pending.name} · ${format(msg.size)}`;
      updateSaveNote();
      els.accept.disabled = !window.showSaveFilePicker && !supportsOpfs && msg.size > maxMemoryFile;
      els.incoming.hidden = false; els.accept.focus();
      status('incomingPrompt');
    }
    if (msg.type === 'accept' && active?.id === msg.id && active.direction === 'send') {
      active.accepted=true;active.paused=false;
      active.remoteReceived=0;
      active.remoteWindow=BlinkSecurity.validFlowWindow(msg.windowBytes)?msg.windowBytes:8*1024*1024;
      ensureSenderHash(active).catch(()=>{});
      pump(msg.id);
    }
    if(msg.type==='flow'&&active?.id===msg.id&&active.direction==='send'&&BlinkSecurity.validFlowUpdate(msg,active.file.size)){
      active.remoteReceived=Math.max(active.remoteReceived||0,msg.received);
      active.remoteWindow=msg.windowBytes;
      active.flowWake?.();
      return;
    }
    if (msg.type === 'resume' && active?.id === msg.id && active.direction === 'send' && Number.isSafeInteger(msg.nextChunk) && msg.nextChunk >= 0) {
      const total=BlinkSecurity.chunkCount(active.file.size,active.chunkSize||defaultChunkSize);if(msg.nextChunk>total)return;
      if (!peerVerified) active.pendingResume = msg.nextChunk; else await resumeOutgoing(msg.nextChunk);
    }
    if(msg.type==='resume-map'&&active?.id===msg.id&&active.direction==='send'){
      const total=Math.ceil(active.file.size/(active.chunkSize||defaultChunkSize));
      if(!BlinkSecurity.validRanges(msg.ranges,total))return;
      if(!peerVerified)active.pendingRanges=msg.ranges;else await resumeOutgoingRanges(msg.ranges);
    }
    if(msg.type==='retry'&&active?.id===msg.id&&active.direction==='send'){
      active.retries=(active.retries||0)+1;setTransferBanner(tr('retryBanner',{attempt:active.retries}),'warning');if(active.retries>2){finishOutgoing('transferFailed');return;}
      active.sent=0;active.nextChunk=0;active.remoteReceived=0;active.remoteWindow=active.remoteWindow||8*1024*1024;active.sendRanges=null;active.paused=false;active.stage='sending';ensureSenderHash(active).catch(()=>{});pump(active.id);
    }
    if (msg.type === 'verify-confirm') { remoteVerified = true; maybeFinishVerification(); }
    if (msg.type === 'decline' && active?.id === msg.id && active.direction === 'send') finishOutgoing('declined');
    if (msg.type === 'cancel') { if (pending?.id === msg.id) { pending = null; els.incoming.hidden = true; status(readyLabel, true); } if (active?.id === msg.id) { if (active.direction === 'send') finishOutgoing('peerCancelled'); else stopTransfer('peerCancelled', false); } }
    if (msg.type === 'complete' && active?.id === msg.id && active.direction === 'receive') {
      await flushReceiveWrites(active);sendFlowUpdate(active,true);
      const totalChunks=Math.ceil(active.size/(active.chunkSize||defaultChunkSize));
      const missing=BlinkTransfer.missingRanges(active);
      if(active.received!==active.size||missing.length){sendResumeMap();return;}
      try {
        let localHash;
        if(active.opfsWorker){
          const finalized=await active.opfsWorker.call('finalize',{size:active.size});localHash=finalized.hash;active.opfsWorker.terminate();active.opfsWorker=null;
        }else{
          if(active.writer){await active.writer.close();active.writer=null;}
          localHash=active.hashDirty?await hashReceivedActive(active):active.hasher.hex();
        }
        if(typeof msg.sha256!=='string'||!/^[a-f0-9]{64}$/.test(msg.sha256)||localHash!==msg.sha256){
          active.retries=(active.retries||0)+1;
          if(active.retries<=2){
            if(active.opfs?.handle){
              try{active.opfsWorker=await createOpfsWorkerBridge(active.opfs.handle,{truncate:true});active.writer=null;}
              catch{active.writer=await active.opfs.handle.createWritable();}
            }else if(active.persistentHandle){active.writer=await active.persistentHandle.createWritable();}else active.chunks=new Array(totalChunks);
            active.received=0;active.committedBytes=0;active.nextChunk=0;active.receivedMap=new Uint8Array(Math.ceil(totalChunks/8));active.totalChunks=totalChunks;active.hasher=new BlinkSHA256();active.hashDirty=false;active.writeBuffer=[];active.writeBufferStart=-1;active.writeBufferBytes=0;active.lastFlowSent=0;active.lastFlowAt=0;active.paused=false;
            channel.send(JSON.stringify({type:'retry',id:msg.id,attempt:active.retries}));progress(0,active.size,active.started,'receiving');return;
          }
          stopTransfer('hashMismatch');return;
        }
        let shareFile=null;
        if(active.opfs){shareFile=await active.opfs.handle.getFile();const url=URL.createObjectURL(shareFile),anchor=document.createElement('a');anchor.href=url;anchor.download=active.name;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
        else if(active.persistentHandle){try{shareFile=await active.persistentHandle.getFile();}catch{}}
        else if(active.chunks){shareFile=new File(active.chunks,active.name,{type:'application/octet-stream'});const url=URL.createObjectURL(shareFile),anchor=document.createElement('a');anchor.href=url;anchor.download=active.name;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
        channel.send(JSON.stringify({ type: 'saved', id: msg.id, sha256: localHash }));
        lastReceivedFile=shareFile;
        els['share-last-file'].hidden=!(shareFile && navigator.share && (!navigator.canShare || navigator.canShare({files:[shareFile]})));
        await recordHistory({name:active.relativePath||active.name,size:active.size,direction:'receive',verified:true,sha256:localHash,peer:peerName});
        if(incomingBatch){incomingBatch.completedBytes=(incomingBatch.completedBytes||0)+active.size;incomingBatch.completedCount=(incomingBatch.completedCount||0)+1;}
        completionCue();
        await clearPersistent();
        stopTransfer('verifiedReceived', false);setTransferBanner();
      } catch { stopTransfer('saveFailed'); }
    }
    if (msg.type === 'saved' && active?.id === msg.id && active.direction === 'send') {
      const sentHash=BlinkTransfer.finalHash(active); if (!sentHash || msg.sha256 !== sentHash) { stopTransfer('hashMismatch', false); return; }
      await recordHistory({name:active.relativePath||active.file.name,size:active.file.size,direction:'send',verified:true,sha256:sentHash,peer:peerName});
      completionCue();
      setTransferBanner();finishOutgoing('verifiedSent', { current: batchDone + 1, total: batchTotal });
    }
    if(msg.type==='text-start'){
      if(!BlinkSecurity.validTextStart(msg))return;
      incomingText={id:msg.id,parts:new Array(msg.parts),bytes:msg.bytes};return;
    }
    if(msg.type==='text-part'){if(!BlinkSecurity.validTextPart(msg,incomingText))return;incomingText.parts[msg.index]=msg.text;return;}
    if(msg.type==='text-end'){if(!incomingText||msg.id!==incomingText.id||incomingText.parts.some(x=>typeof x!=='string'))return;const text=incomingText.parts.join(''),expected=incomingText.bytes;incomingText=null;if(new TextEncoder().encode(text).byteLength!==expected)return;await receiveTextValue(text);return;}
    if (msg.type === 'text' && typeof msg.text === 'string') { const bytes=new TextEncoder().encode(msg.text).byteLength;if(bytes<=maxTextBytes)await receiveTextValue(msg.text); }
  }
  async function receiveChunk(data) {
    if(!active||active.direction!=='receive')return;
    const unpacked=BlinkTransfer.unpackChunk(data);if(!unpacked)return;
    const {seq,payload}=unpacked,size=active.chunkSize||defaultChunkSize;
    const check=BlinkTransfer.inspectChunk(active,seq,payload.byteLength);
    if(!check.ok){stopTransfer('excess');return;}if(check.duplicate)return;
    const offset=check.offset;
    try{
      if(active.writer||active.opfsWorker){
        const target=Math.max(size,tuning.writeBatch||1024*1024);
        const expected=active.writeBuffer?.length?(active.writeBufferStart+active.writeBufferBytes):offset;
        if(active.writeBuffer?.length&&offset!==expected){
          await flushReceiveWrites(active);
          const afterFlush=BlinkTransfer.inspectChunk(active,seq,payload.byteLength);
          if(!afterFlush.ok){stopTransfer('excess');return;}if(afterFlush.duplicate)return;
        }
        if(!active.writeBuffer?.length){active.writeBuffer=[];active.writeBufferStart=offset;active.writeBufferBytes=0;}
        if(active.opfsWorker){
          active.writeBuffer.push({seq,offset,payload});
        }else{
          const copied=payload.slice();active.writeBuffer.push({seq,offset,payload:copied});
        }
        active.writeBufferBytes+=payload.byteLength;
        if(active.writeBufferBytes>=target)await flushReceiveWrites(active);
      }else{
        if(seq!==active.nextChunk)active.hashDirty=true;
        if(!active.hashDirty&&seq===active.nextChunk)active.hasher.update(payload);
        active.chunks[seq]=payload.slice();BlinkTransfer.commitChunk(active,seq,payload.byteLength);
        progress(active.received,active.size,active.started,'receiving');sendFlowUpdate(active);
      }
    }catch{stopTransfer('writeFailed');}
  }
  async function acceptPendingFile(fromBatch = false) {
    if (!pending || active || pending.type === 'batch') return;
    const request = pending;
    let writer, opfs, persistentHandle;
    if (fromBatch && incomingBatch?.rootHandle) {
      try { const parts=(request.relativePath || request.name).split('/').filter(Boolean); if (parts[0] === incomingBatch.name) parts.shift(); persistentHandle = await BlinkStorage.nestedFileHandle(incomingBatch.rootHandle, parts.join('/'), request.name); writer = await persistentHandle.createWritable(); }
      catch { notice('saveLocationFailed'); return; }
    } else if (window.showSaveFilePicker) {
      try { persistentHandle = await showSaveFilePicker({ suggestedName: request.name }); writer = await persistentHandle.createWritable(); }
      catch (error) { if (error.name === 'AbortError') return; notice('saveLocationFailed'); return; }
    } else if (supportsOpfs && request.size > maxMemoryFile) {
      try {
        const root = await navigator.storage.getDirectory(),tempName=`blinksend-${crypto.randomUUID()}.part`,handle=await root.getFileHandle(tempName,{create:true});
        persistentHandle=handle;opfs={root,handle,tempName};
        try{opfs.worker=await createOpfsWorkerBridge(handle,{truncate:true});}
        catch{writer=await handle.createWritable();}
      } catch { notice('saveLocationFailed'); return; }
    }
    if (pending?.id !== request.id) { writer?.abort(); opfs?.worker?.terminate?.(); return; }
    pending = null; els.incoming.hidden = true;
    const receiveChunkSize=request.chunkSize||defaultChunkSize,receiveState=BlinkTransfer.makeReceiveState(request.size,receiveChunkSize);if(!receiveState){notice('transferFailed');return;}const totalChunks=receiveState.totalChunks;
    const flowWindow=Math.min(BlinkSecurity.LIMITS.flowWindowMax,Math.max(BlinkSecurity.LIMITS.flowWindowMin,tuning.receiveWindow||16*1024*1024));
    const opfsWorker=opfs?.worker||null;if(opfs)delete opfs.worker;
    active = { ...request, direction:'receive', ...receiveState, committedBytes:0, hasher:new BlinkSHA256(), hashDirty:false, retries:0, chunks:(writer||opfsWorker) ? null : new Array(totalChunks), writer, opfsWorker, opfs, persistentHandle, writeBuffer:[], writeBufferStart:-1, writeBufferBytes:0, flowWindow, lastFlowSent:0, lastFlowAt:0, started:Date.now(), paused:false };
    showTransfer(request.relativePath || request.name, request.size);
    await persistReceiveSession();
    channel.send(JSON.stringify({ type:'accept', id:request.id, windowBytes:flowWindow }));
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
      incomingBatch = { id:request.id, name:request.name, rootHandle, accepted:true, totalSize:request.totalSize, count:request.count, completedBytes:0, completedCount:0 };
      await persistBatchContext();
      pending = null; els.incoming.hidden = true; channel.send(JSON.stringify({ type:'batch-accept', id:request.id })); status('verified', true); return;
    }
    await acceptPendingFile(false);
  };
  els.decline.onclick = () => { if (pending) channel.send(JSON.stringify({ type: pending.type === 'batch' ? 'batch-decline' : 'decline', id: pending.id })); pending = null; els.incoming.hidden = true; status(peerVerified ? 'verified' : 'verifyStatus', peerVerified); };
  els['verify-match'].onclick = () => { if (localVerified || channel?.readyState !== 'open') return; localVerified = true; els['verify-match'].disabled = true; channel.send(JSON.stringify({ type: 'verify-confirm' })); maybeFinishVerification(); };
  els.cancel.onclick = () => stopTransfer('cancelled');
  els.file.onchange = () => { const files=[...els.file.files]; els.file.value=''; enqueueFiles(files); };
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
    try { const handle = await showDirectoryPicker({ mode:'read' }); const entries = await BlinkStorage.collectDirectory(handle, handle.name); enqueueEntries(entries, handle.name); }
    catch (error) { if (error.name !== 'AbortError') notice('saveLocationFailed'); }
  };
  els.folder.onchange = () => { const files=[...els.folder.files]; els.folder.value=''; const name=files[0]?.webkitRelativePath?.split('/')[0] || ''; enqueueEntries(files.map(file=>({file,relativePath:file.webkitRelativePath||''})), name); };
  async function receiveTextValue(text){
    const bytes=new TextEncoder().encode(text).byteLength;if(bytes>maxTextBytes)return;
    els['received-content'].textContent=text;els['received-text'].hidden=false;let link='';
    try{const u=new URL(text.trim());if(['http:','https:'].includes(u.protocol))link=u.href;}catch{}
    els['received-link'].hidden=!link;if(link){els['received-link'].href=link;els['received-link'].textContent=link;}
    await recordHistory({name:link||'Text',size:bytes,direction:'receive',verified:false,type:'text'});completionCue();
  }
  async function sendTextValue(value) {
    if(channel?.readyState!=='open'||!peerVerified)return;
    const text=String(value||'');if(!text.trim())return;
    const bytes=new TextEncoder().encode(text).byteLength;if(bytes>maxTextBytes){notice('textTooLarge');return;}
    const parts=BlinkProtocol.splitUtf8(text);const id=crypto.randomUUID();
    channel.send(JSON.stringify({type:'text-start',id,parts:parts.length,bytes}));
    for(let i=0;i<parts.length;i++)channel.send(JSON.stringify({type:'text-part',id,index:i,text:parts[i]}));
    channel.send(JSON.stringify({type:'text-end',id}));
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
  async function collectLegacyEntry(entry,prefix=''){
    const path=prefix?prefix+'/'+entry.name:entry.name;if(entry.isFile)return [await new Promise((resolve,reject)=>entry.file(file=>resolve({file,relativePath:path}),reject))];
    if(!entry.isDirectory)return [];const reader=entry.createReader(),children=[];while(true){const batch=await new Promise((resolve,reject)=>reader.readEntries(resolve,reject));if(!batch.length)break;children.push(...batch);}
    const out=[];for(const child of children)out.push(...await collectLegacyEntry(child,path));return out;
  }
  async function collectDrop(dt){
    const items=[...(dt.items||[])],entries=[];
    if(items.length&&items.some(i=>typeof i.getAsFileSystemHandle==='function')){
      for(const item of items){const handle=await item.getAsFileSystemHandle?.();if(!handle)continue;if(handle.kind==='directory')entries.push(...await BlinkStorage.collectDirectory(handle,handle.name));else entries.push({handle,file:await handle.getFile(),relativePath:''});}
      return entries;
    }
    if(items.length&&items.some(i=>typeof i.webkitGetAsEntry==='function')){for(const item of items){const entry=item.webkitGetAsEntry?.();if(entry)entries.push(...await collectLegacyEntry(entry));}if(entries.length)return entries;}
    return [...(dt.files||[])].map(file=>({file,relativePath:file.webkitRelativePath||''}));
  }
  els.drop.ondrop = async e => { e.preventDefault(); els.drop.classList.remove('drag'); if(els.file.disabled)return;try{const entries=await collectDrop(e.dataTransfer);enqueueEntries(entries);}catch{enqueueFiles(e.dataTransfer.files);} };
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
  async function joinByCode(){
    const code=els['join-code'].value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);if(code.length!==8){notice('invalidCode');return;}
    try{const response=await fetch('/pair/resolve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});if(!response.ok)throw new Error();const data=await response.json();if(!roomPattern.test(data.room))throw new Error();startReceiveRoom(data.room);}catch{notice('invalidCode');}
  }
  els['join-code-button'].onclick=joinByCode;
  els['join-code'].onkeydown=e=>{if(e.key==='Enter')joinByCode();};
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
    const s=resumeSession; if (!BlinkSecurity.validPersistedSession(s)) { await clearPersistent(); resumeSession=null; els['resume-card'].hidden=true; notice('resumeUnavailable'); return; }
    const access = s.role === 'receive' ? 'readwrite' : 'read';
    try { if (!(await ensurePermission(s.handle, access))) { notice('resumePermission'); return; } } catch { notice('resumePermission'); return; }
    if (s.role === 'send') {
      const file=await s.handle.getFile(); if(file.size!==s.size||(s.lastModified!=null&&file.lastModified!==s.lastModified)){await clearPersistent();resumeSession=null;els['resume-card'].hidden=true;notice('resumeUnavailable');return;} mode='send'; setRole('send');
      outgoingBatch = s.batchId ? { id:s.batchId, name:s.batchName || 'Folder', entries:(s.batchEntries || []).map(x=>x) } : null;
      batchTotal = s.batchEntries?.length || 1; batchDone = s.batchDone || 0;
      if (s.batchEntries?.length) {
        const idx=s.batchEntries.findIndex(x=>x.name===s.name && x.relativePath===s.relativePath);
        outgoing = s.batchEntries.slice(Math.max(0,idx+1)).map(x=>({ ...x, file:null }));
        for (const entry of outgoing) entry.file = await entry.handle.getFile();
      }
      retuneConnection();
      active={ id:s.transferId, direction:'send', file, sourceEntry:{handle:s.handle,file,relativePath:s.relativePath}, relativePath:s.relativePath||'', batchId:s.batchId||null, chunkSize:s.chunkSize||defaultChunkSize,highWater:tuning.highWater,sent:0,nextChunk:0,remoteReceived:0,remoteWindow:8*1024*1024,flowWake:null,hasher:null,fullHash:'',hashTask:null,hashPromise:null,started:Date.now(),accepted:true,paused:true };
      showTransfer(s.relativePath || s.name, s.size); active.stage='resuming'; renderTransfer();
    } else {
      const existing=await s.handle.getFile(),restoredChunk=s.chunkSize||defaultChunkSize,totalChunks=Math.ceil(s.size/restoredChunk);
      const received=Math.min(Number(s.received)||0,s.size),nextChunk=Number.isSafeInteger(s.nextChunk)?Math.min(s.nextChunk,totalChunks):Math.floor(received/restoredChunk),prefixBytes=Math.min(s.size,nextChunk*restoredChunk);
      let writer=null,opfsWorker=null,restoredOpfs=null;
      incomingBatch=s.batchId?{id:s.batchId,name:s.batchName,rootHandle:s.batchRootHandle,accepted:true}:null;
      if(s.opfs&&s.opfsTempName){
        const root=await navigator.storage.getDirectory();restoredOpfs={root,handle:s.handle,tempName:s.opfsTempName};
        try{opfsWorker=await createOpfsWorkerBridge(s.handle,{resumeBytes:prefixBytes});}catch{writer=await s.handle.createWritable({keepExistingData:true});}
      }else writer=await s.handle.createWritable({keepExistingData:true});
      const restoredMap=s.receivedMap instanceof Uint8Array?s.receivedMap:BlinkTransfer.makePrefixBitmap(totalChunks,nextChunk),restoredState=BlinkTransfer.makeReceiveState(s.size,restoredChunk,restoredMap,nextChunk,received),hashDirty=received!==prefixBytes;if(!restoredState){notice('resumeUnavailable');opfsWorker?.terminate?.();await discardResume();return;}
      active={id:s.transferId,direction:'receive',name:s.name,size:s.size,relativePath:s.relativePath||'',...restoredState,committedBytes:received,hasher:opfsWorker?new BlinkSHA256():await rebuildReceiveHasher(s.handle,prefixBytes),hashDirty,retries:0,chunks:null,writer,opfsWorker,persistentHandle:s.handle,opfs:restoredOpfs,writeBuffer:[],writeBufferStart:-1,writeBufferBytes:0,flowWindow:tuning.receiveWindow||16*1024*1024,lastFlowSent:received,lastFlowAt:0,started:Date.now(),paused:true,batchId:s.batchId||null};
      showTransfer(s.relativePath || s.name,s.size); active.stage='resuming'; renderTransfer();
    }
    els['resume-card'].hidden=true; resumeSession=null;
  }
  els['resume-transfer'].onclick = restoreSession;
  els['discard-resume'].onclick = async () => { await clearPersistent(); await clearBatchContext(); resumeSession=null; incomingBatch=null; els['resume-card'].hidden=true; };
  async function registerNearby(){
    if(!room||mode!=='send'||!nearbyDiscovery)return;
    try{const r=await fetch('/nearby/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room,name:deviceName,listed:true})});if(r.ok){const data=await r.json();els['nearby-code'].textContent=tr('nearbyCode',{code:data.code});}}catch{}
  }
  async function unregisterNearby(){
    els['nearby-code'].textContent='';if(!room)return;try{await fetch('/nearby/unregister',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room})});}catch{}
  }
  async function findNearby(){
    els['nearby-results'].hidden=false;els['nearby-results'].textContent='';
    try{const r=await fetch('/nearby',{cache:'no-store'}),data=r.ok?await r.json():{items:[]};if(!data.items?.length){els['nearby-results'].textContent=tr('noNearby');return;}
      for(const item of data.items){const row=document.createElement('div');row.className='nearby-result';const label=document.createElement('span');label.textContent=item.name||'BlinkSend device';const button=document.createElement('button');button.className='button secondary';button.textContent=item.code;button.onclick=async()=>{const rr=await fetch('/nearby/resolve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:item.code})});if(rr.ok){const found=await rr.json();stopScanner();startReceiveRoom(found.room);}};row.append(label,button);els['nearby-results'].append(row);}
    }catch{els['nearby-results'].textContent=tr('noNearby');}
  }
  function stopScanner(){cancelAnimationFrame(scannerLoop);scannerLoop=0;if(scannerStream){for(const track of scannerStream.getTracks())track.stop();scannerStream=null;}els['qr-scanner'].hidden=true;els['scanner-video'].srcObject=null;}
  async function startScanner(){
    if(!('BarcodeDetector' in window)||!navigator.mediaDevices?.getUserMedia){notice('scannerUnsupported');return;}
    try{const supported=await BarcodeDetector.getSupportedFormats?.();if(supported&&!supported.includes('qr_code')){notice('scannerUnsupported');return;}scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});els['scanner-video'].srcObject=scannerStream;await els['scanner-video'].play();els['qr-scanner'].hidden=false;const detector=new BarcodeDetector({formats:['qr_code']});
      const tick=async()=>{if(!scannerStream)return;try{const codes=await detector.detect(els['scanner-video']);for(const code of codes){try{const u=new URL(code.rawValue),id=u.hash.slice(1).toLowerCase();if(u.origin===location.origin&&roomPattern.test(id)){stopScanner();startReceiveRoom(id);return;}}catch{}}}catch{}scannerLoop=requestAnimationFrame(tick);};tick();
    }catch{stopScanner();notice('cameraDenied');}
  }
  els['clear-queue'].onclick=()=>{if(outgoingBatch)return;outgoing=[];batchTotal=active?batchDone+1:0;renderQueue();renderTransfer();};
  els['send-another'].onclick=()=>{els['post-transfer'].hidden=true;setTransferBanner();els.drop.scrollIntoView({behavior:'smooth',block:'center'});};
  els['diagnostics-toggle'].onclick=()=>{const show=els['diagnostics-panel'].hidden;els['diagnostics-panel'].hidden=!show;els['diagnostics-toggle'].textContent=tr(show?'hideDiagnostics':'showDiagnostics');clearInterval(diagnosticsTimer);if(show){updateDiagnostics();diagnosticsTimer=setInterval(updateDiagnostics,1000);}};
  els['settings-toggle'].onclick=()=>{els['settings-panel'].hidden=!els['settings-panel'].hidden;if(!els['settings-panel'].hidden)renderHistory();};
  els['settings-close'].onclick=()=>{els['settings-panel'].hidden=true;clearInterval(diagnosticsTimer);diagnosticsTimer=0;};
  els['device-name'].value=deviceName;renderRecentPeers();updateDiagnostics();
  els['device-name'].onchange=()=>{deviceName=sanitizeDeviceName(els['device-name'].value)||'BlinkSend device';els['device-name'].value=deviceName;saveSetting('blinksend-device-name',deviceName);if(channel?.readyState==='open')channel.send(JSON.stringify({type:'hello',name:deviceName}));if(nearbyDiscovery)registerNearby();};
  els['notify-complete'].checked=completionFeedback;
  els['nearby-discovery'].checked=nearbyDiscovery;
  els['nearby-discovery'].onchange=async()=>{nearbyDiscovery=els['nearby-discovery'].checked;saveSetting('blinksend-nearby',nearbyDiscovery?'1':'0');if(nearbyDiscovery)await registerNearby();else await unregisterNearby();};
  els['find-nearby'].onclick=findNearby;
  els['scan-qr'].onclick=startScanner;
  els['scanner-close'].onclick=stopScanner;
  els['notify-complete'].onchange=()=>{completionFeedback=els['notify-complete'].checked;saveSetting('blinksend-completion-feedback',completionFeedback?'1':'0');};
  els['clear-history'].onclick=async()=>{try{await BlinkStore?.clearHistory?.();}catch{}await renderHistory();};
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;els['install-app'].hidden=false;});
  window.addEventListener('appinstalled',()=>{installPrompt=null;els['install-app'].hidden=true;});
  els['install-app'].onclick=async()=>{if(!installPrompt)return;try{await installPrompt.prompt();await installPrompt.userChoice;}catch{}installPrompt=null;els['install-app'].hidden=true;};
  async function initMode() {
    pendingSharedTarget=await consumeShareTarget();
    if(pendingSharedTarget&&!room){room=newRoomId();history.replaceState(null,'',location.pathname+'#'+room);setRole('send');updateRoomUi();connect();notice('sharedReady');return;}
    if (room) {
      let role='receive'; try { role=sessionStorage.getItem(`blinksend-role:${room}`) || 'receive'; } catch {}
      setRole(role); updateRoomUi(); connect(); await checkResume();
    } else { els['mode-picker'].hidden=false; els['transfer-workspace'].hidden=true; }
  }
  setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'heartbeat' })); }, 30_000);
  applyLanguage();
  initMode();
})();
