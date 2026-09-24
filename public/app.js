(() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['qr','copy','new-room','status','status-dot','file','drop','transfer-info','file-name','file-size','progress','progress-text','cancel','queue-status','notice','incoming','incoming-detail','save-note','accept','decline'].map(id => [id, $(id)]));
  const chunkSize = 32 * 1024;
  const maxMemoryFile = 200 * 1024 * 1024;
  const format = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;
  let socket, pc, channel, pending, active, incomingQueue = Promise.resolve(), signalQueue = Promise.resolve(), connectTimer;
  let readyLabel = 'Connected — ready to send';
  let outgoing = [], batchTotal = 0, batchDone = 0;
  let room = location.hash.slice(1).toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(room)) { room = [...crypto.getRandomValues(new Uint8Array(16))].map(v => v.toString(16).padStart(2,'0')).join(''); history.replaceState(null, '', `${location.pathname}${location.search}#${room}`); }
  const roomLink = () => `${location.origin}${location.pathname}#${room}`;
  els.qr.src = `/qr?url=${encodeURIComponent(roomLink())}`;
  function status(message, ready = false) {
    els.status.textContent = message;
    els['status-dot'].classList.toggle('ready', ready);
    els.file.disabled = !ready || !!active || !!pending;
    els.drop.classList.toggle('disabled', els.file.disabled);
  }
  function notice(message = '') { els.notice.textContent = message; }
  function signal(type, payload) { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload })); }
  function resetPeer() {
    clearTimeout(connectTimer);
    if (active) stopTransfer('Connection lost. Transfer stopped.', false);
    pending = null; els.incoming.hidden = true;
    channel?.close(); pc?.close(); channel = null; pc = null;
    status('Waiting for another device…');
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
      readyLabel = !pair ? 'Connected — ready to send' : relayed ? 'Connected via relay — ready to send' : 'Connected directly — ready to send';
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
        status('Could not connect devices');
        notice('Check that both tabs are open, then refresh them. Some networks require a TURN relay.');
      }
    }, 20_000);
    pc.onicecandidate = e => { if (e.candidate) signal('candidate', e.candidate.toJSON()); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected' && channel?.readyState === 'open') connectionPath();
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { if (active) stopTransfer('Connection lost. Transfer stopped.', false); status('Connection interrupted. Try refreshing both devices.'); }
    };
    pc.ondatachannel = e => setupChannel(e.channel);
  }
  function setupChannel(ch) {
    channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.bufferedAmountLowThreshold = 512 * 1024;
    ch.onopen = () => { clearTimeout(connectTimer); connectionPath(); notice(); };
    ch.onclose = () => { if (active) stopTransfer('Connection lost. Transfer stopped.', false); status('Other device disconnected'); };
    ch.onmessage = e => {
      incomingQueue = incomingQueue.then(() => typeof e.data === 'string' ? control(e.data) : receiveChunk(e.data)).catch(() => {
        if (active) stopTransfer('Transfer failed. Please try again.');
      });
    };
  }
  function connect() {
    socket = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/signal`);
    socket.onopen = () => socket.send(JSON.stringify({ type: 'join', room }));
    socket.onmessage = e => { signalQueue = signalQueue.then(async () => {
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      try {
        if (msg.type === 'joined') status(msg.count === 1 ? 'Waiting for another device…' : 'Connecting devices…');
        if (msg.type === 'full') { status('Room full'); notice('Only two devices can join a room. Create a new room to start over.'); }
        if (msg.type === 'peer-left') resetPeer();
        if (msg.type === 'peer-joined') { await makePeer(); setupChannel(pc.createDataChannel('files', { ordered: true })); await pc.setLocalDescription(await pc.createOffer()); signal('offer', pc.localDescription.toJSON()); status('Connecting devices…'); }
        if (msg.type === 'offer') { await makePeer(); await pc.setRemoteDescription(msg.payload); await pc.setLocalDescription(await pc.createAnswer()); signal('answer', pc.localDescription.toJSON()); status('Connecting devices…'); }
        if (msg.type === 'answer' && pc) await pc.setRemoteDescription(msg.payload);
        if (msg.type === 'candidate' && pc) await pc.addIceCandidate(msg.payload);
      } catch { notice('Could not establish a direct connection. Refresh both devices and try again.'); }
    }).catch(() => notice('Could not establish a direct connection. Refresh both devices and try again.')); };
    socket.onclose = e => {
      if (e.code === 1008) return;
      resetPeer(); setTimeout(connect, 2000);
      status(e.code === 1001 ? 'Room expired — reconnecting…' : 'Reconnecting to room…');
    };
  }
  function showTransfer(name, size) {
    els['transfer-info'].hidden = false; els['file-name'].textContent = name; els['file-size'].textContent = format(size);
    els.progress.value = 0; els['progress-text'].textContent = 'Starting…';
    els.file.disabled = true; els.drop.classList.add('disabled');
    els['queue-status'].hidden = batchTotal < 2 || active?.direction !== 'send';
    els['queue-status'].textContent = `File ${batchDone + 1} of ${batchTotal} · ${outgoing.length} remaining`;
    els.cancel.textContent = batchTotal > 1 && active?.direction === 'send' ? 'Cancel batch' : 'Cancel';
  }
  function progress(bytes, total, started, label) {
    els.progress.value = total ? Math.min(100, bytes / total * 100) : 100;
    const speed = (bytes / Math.max(1, (Date.now() - started) / 1000));
    els['progress-text'].textContent = `${label} ${format(bytes)} of ${format(total)} · ${format(speed)}/s`;
  }
  function stopTransfer(message, notify = true, preserveQueue = false) {
    if (notify && active && channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'cancel', id: active.id }));
    if (active?.writer) active.writer.abort().catch(() => {});
    active = null;
    if (!preserveQueue) { outgoing = []; batchTotal = 0; batchDone = 0; }
    els['transfer-info'].hidden = true; els.file.value = '';
    status(channel?.readyState === 'open' ? readyLabel : 'Waiting for another device…', channel?.readyState === 'open');
    notice(message);
  }
  async function sendFile(file) {
    if (!file || channel?.readyState !== 'open' || active || pending) return;
    const id = crypto.randomUUID(); active = { id, direction: 'send', file, sent: 0, started: Date.now(), accepted: false };
    showTransfer(file.name, file.size);
    channel.send(JSON.stringify({ type: 'request', id, name: file.name, size: file.size }));
    els['progress-text'].textContent = 'Waiting for acceptance…';
  }
  function sendNext() {
    if (active || pending || channel?.readyState !== 'open') return;
    const file = outgoing.shift();
    if (file) { notice(); sendFile(file); }
    else { batchTotal = 0; batchDone = 0; }
  }
  function finishOutgoing(message) {
    stopTransfer(message, false, true);
    batchDone++;
    if (outgoing.length) setTimeout(sendNext, 0);
    else { batchTotal = 0; batchDone = 0; }
  }
  function enqueueFiles(files) {
    if (!files?.length || channel?.readyState !== 'open' || active || pending) return;
    outgoing = [...files]; batchTotal = outgoing.length; batchDone = 0;
    sendNext();
  }
  async function pump(id) {
    try {
      const file = active?.file;
      if (!file || active.id !== id) return;
      while (active?.id === id && active.sent < file.size) {
        if (channel.readyState !== 'open') throw new Error('Connection closed');
        if (channel.bufferedAmount > 1024 * 1024) { await new Promise(resolve => { channel.addEventListener('bufferedamountlow', resolve, { once: true }); }); continue; }
        const part = await file.slice(active.sent, active.sent + chunkSize).arrayBuffer();
        if (active?.id !== id) return;
        channel.send(part); active.sent += part.byteLength;
        progress(active.sent, file.size, active.started, 'Sending');
      }
      if (active?.id === id) { channel.send(JSON.stringify({ type: 'complete', id })); els['progress-text'].textContent = 'Finishing on other device…'; }
    } catch { if (active?.id === id) stopTransfer('Transfer failed. Please try again.'); }
  }
  async function control(raw) {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'request') {
      if (active || pending || typeof msg.name !== 'string' || msg.name.length > 255 || !Number.isSafeInteger(msg.size) || msg.size < 0 || typeof msg.id !== 'string') { channel.send(JSON.stringify({ type: 'decline', id: msg.id })); return; }
      pending = { id: msg.id, name: msg.name.replace(/[\\/\x00-\x1f\x7f]/g, '_').trim() || 'download', size: msg.size };
      els['incoming-detail'].textContent = `${pending.name} · ${format(msg.size)}`;
      els['save-note'].textContent = !window.showSaveFilePicker && msg.size > maxMemoryFile ? 'This browser cannot stream large downloads to disk. Use a desktop Chrome browser to receive this file.' : 'Choose where to save it if your browser supports that option.';
      els.accept.disabled = !window.showSaveFilePicker && msg.size > maxMemoryFile;
      els.incoming.hidden = false; els.accept.focus();
      status('Incoming file — choose whether to accept');
    }
    if (msg.type === 'accept' && active?.id === msg.id && active.direction === 'send') { active.accepted = true; pump(msg.id); }
    if (msg.type === 'decline' && active?.id === msg.id && active.direction === 'send') finishOutgoing('Other device declined the file.');
    if (msg.type === 'cancel') { if (pending?.id === msg.id) { pending = null; els.incoming.hidden = true; status(readyLabel, true); } if (active?.id === msg.id) { if (active.direction === 'send') finishOutgoing('Transfer cancelled by other device.'); else stopTransfer('Transfer cancelled by other device.', false); } }
    if (msg.type === 'complete' && active?.id === msg.id && active.direction === 'receive') {
      if (active.received !== active.size) { stopTransfer('Transfer incomplete. Please try again.'); return; }
      try {
        if (active.writer) await active.writer.close();
        else { const url = URL.createObjectURL(new Blob(active.chunks)); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); }
        channel.send(JSON.stringify({ type: 'saved', id: msg.id }));
        stopTransfer('File received successfully.', false);
      } catch { stopTransfer('Could not save file. Please try again.'); }
    }
    if (msg.type === 'saved' && active?.id === msg.id && active.direction === 'send') finishOutgoing(batchTotal > 1 ? `File ${batchDone + 1} of ${batchTotal} sent successfully.` : 'File sent successfully.');
  }
  async function receiveChunk(data) {
    if (!active || active.direction !== 'receive') return;
    if (active.received + data.byteLength > active.size) { stopTransfer('Received more data than expected. Transfer stopped.'); return; }
    try {
      if (active.writer) await active.writer.write(data); else active.chunks.push(data);
      active.received += data.byteLength;
      progress(active.received, active.size, active.started, 'Receiving');
    } catch { stopTransfer('Could not write file. Please try again.'); }
  }
  els.accept.onclick = async () => {
    if (!pending || active) return;
    const request = pending;
    let writer;
    if (window.showSaveFilePicker) {
      try { const handle = await showSaveFilePicker({ suggestedName: request.name }); writer = await handle.createWritable(); }
      catch (error) { if (error.name === 'AbortError') return; notice('Could not open a location to save the file.'); return; }
    }
    if (pending?.id !== request.id) { writer?.abort(); return; }
    pending = null; els.incoming.hidden = true;
    active = { ...request, direction: 'receive', received: 0, chunks: writer ? null : [], writer, started: Date.now() };
    showTransfer(request.name, request.size);
    channel.send(JSON.stringify({ type: 'accept', id: request.id }));
  };
  els.decline.onclick = () => { if (pending) channel.send(JSON.stringify({ type: 'decline', id: pending.id })); pending = null; els.incoming.hidden = true; status(readyLabel, true); };
  els.cancel.onclick = () => stopTransfer('Transfer cancelled.');
  els.file.onchange = () => enqueueFiles(els.file.files);
  els.drop.ondragover = e => { e.preventDefault(); if (!els.file.disabled) els.drop.classList.add('drag'); };
  els.drop.ondragleave = () => els.drop.classList.remove('drag');
  els.drop.ondrop = e => { e.preventDefault(); els.drop.classList.remove('drag'); if (!els.file.disabled) enqueueFiles(e.dataTransfer.files); };
  els.copy.onclick = async () => { try { await navigator.clipboard.writeText(roomLink()); els.copy.textContent = 'Link copied'; setTimeout(() => els.copy.textContent = 'Copy invite link', 1800); } catch { notice('Could not copy the link. Copy it from your browser address bar.'); } };
  els['new-room'].onclick = () => { if (active) { notice('Finish or cancel the current transfer first.'); return; } location.href = location.pathname; };
  setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'heartbeat' })); }, 30_000);
  connect();
})();
