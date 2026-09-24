(() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries(['qr','copy','new-room','status','status-dot','file','drop','transfer-info','file-name','file-size','progress','progress-text','cancel','notice','incoming','incoming-detail','save-note','accept','decline'].map(id => [id, $(id)]));
  const chunkSize = 32 * 1024;
  const maxMemoryFile = 200 * 1024 * 1024;
  const format = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;
  let socket, pc, channel, pending, active, incomingQueue = Promise.resolve(), signalQueue = Promise.resolve();
  let room = location.hash.slice(1).toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(room)) { room = [...crypto.getRandomValues(new Uint8Array(16))].map(v => v.toString(16).padStart(2,'0')).join(''); history.replaceState(null, '', `${location.pathname}${location.search}#${room}`); }
  const roomLink = () => location.href;
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
    if (active) stopTransfer('Connection lost. Transfer stopped.', false);
    pending = null; els.incoming.hidden = true;
    channel?.close(); pc?.close(); channel = null; pc = null;
    status('Waiting for another device…');
  }
  function makePeer() {
    pc?.close();
    pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pc.onicecandidate = e => { if (e.candidate) signal('candidate', e.candidate.toJSON()); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { status('Connection interrupted. Try refreshing both devices.'); if (active) stopTransfer('Connection lost. Transfer stopped.', false); }
    };
    pc.ondatachannel = e => setupChannel(e.channel);
  }
  function setupChannel(ch) {
    channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.bufferedAmountLowThreshold = 512 * 1024;
    ch.onopen = () => { status('Connected — ready to send', true); notice(); };
    ch.onclose = () => { status('Other device disconnected'); if (active) stopTransfer('Connection lost. Transfer stopped.', false); };
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
        if (msg.type === 'peer-joined') { makePeer(); setupChannel(pc.createDataChannel('files', { ordered: true })); await pc.setLocalDescription(await pc.createOffer()); signal('offer', pc.localDescription.toJSON()); status('Connecting devices…'); }
        if (msg.type === 'offer') { makePeer(); await pc.setRemoteDescription(msg.payload); await pc.setLocalDescription(await pc.createAnswer()); signal('answer', pc.localDescription.toJSON()); status('Connecting devices…'); }
        if (msg.type === 'answer' && pc) await pc.setRemoteDescription(msg.payload);
        if (msg.type === 'candidate' && pc) await pc.addIceCandidate(msg.payload);
      } catch { notice('Could not establish a direct connection. Refresh both devices and try again.'); }
    }).catch(() => notice('Could not establish a direct connection. Refresh both devices and try again.')); };
    socket.onclose = e => {
      if (e.code === 1008 || e.code === 1001) return;
      status('Reconnecting to room…');
      resetPeer(); setTimeout(connect, 2000);
    };
  }
  function showTransfer(name, size) {
    els['transfer-info'].hidden = false; els['file-name'].textContent = name; els['file-size'].textContent = format(size);
    els.progress.value = 0; els['progress-text'].textContent = 'Starting…';
    els.file.disabled = true; els.drop.classList.add('disabled');
  }
  function progress(bytes, total, started, label) {
    els.progress.value = total ? Math.min(100, bytes / total * 100) : 100;
    const speed = (bytes / Math.max(1, (Date.now() - started) / 1000));
    els['progress-text'].textContent = `${label} ${format(bytes)} of ${format(total)} · ${format(speed)}/s`;
  }
  function stopTransfer(message, notify = true) {
    if (notify && active && channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'cancel', id: active.id }));
    if (active?.writer) active.writer.abort().catch(() => {});
    active = null;
    els['transfer-info'].hidden = true; els.file.value = '';
    status(channel?.readyState === 'open' ? 'Connected — ready to send' : 'Waiting for another device…', channel?.readyState === 'open');
    notice(message);
  }
  async function sendFile(file) {
    if (!file || channel?.readyState !== 'open' || active || pending) return;
    const id = crypto.randomUUID(); active = { id, direction: 'send', file, sent: 0, started: Date.now(), accepted: false };
    showTransfer(file.name, file.size);
    channel.send(JSON.stringify({ type: 'request', id, name: file.name, size: file.size }));
    els['progress-text'].textContent = 'Waiting for acceptance…';
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
      pending = { id: msg.id, name: msg.name, size: msg.size };
      els['incoming-detail'].textContent = `${msg.name} · ${format(msg.size)}`;
      els['save-note'].textContent = !window.showSaveFilePicker && msg.size > maxMemoryFile ? 'This browser cannot stream large downloads to disk. Use a desktop Chrome browser to receive this file.' : 'Choose where to save it if your browser supports that option.';
      els.accept.disabled = !window.showSaveFilePicker && msg.size > maxMemoryFile;
      els.incoming.hidden = false; els.accept.focus();
      status('Incoming file — choose whether to accept');
    }
    if (msg.type === 'accept' && active?.id === msg.id && active.direction === 'send') { active.accepted = true; pump(msg.id); }
    if (msg.type === 'decline' && active?.id === msg.id) stopTransfer('Other device declined the file.', false);
    if (msg.type === 'cancel') { if (pending?.id === msg.id) { pending = null; els.incoming.hidden = true; status('Connected — ready to send', true); } if (active?.id === msg.id) stopTransfer('Transfer cancelled by other device.', false); }
    if (msg.type === 'complete' && active?.id === msg.id && active.direction === 'receive') {
      if (active.received !== active.size) { stopTransfer('Transfer incomplete. Please try again.'); return; }
      try {
        if (active.writer) await active.writer.close();
        else { const url = URL.createObjectURL(new Blob(active.chunks)); const anchor = document.createElement('a'); anchor.href = url; anchor.download = active.name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); }
        channel.send(JSON.stringify({ type: 'saved', id: msg.id }));
        stopTransfer('File received successfully.', false);
      } catch { stopTransfer('Could not save file. Please try again.'); }
    }
    if (msg.type === 'saved' && active?.id === msg.id && active.direction === 'send') stopTransfer('File sent successfully.', false);
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
  els.decline.onclick = () => { if (pending) channel.send(JSON.stringify({ type: 'decline', id: pending.id })); pending = null; els.incoming.hidden = true; status('Connected — ready to send', true); };
  els.cancel.onclick = () => stopTransfer('Transfer cancelled.');
  els.file.onchange = () => sendFile(els.file.files?.[0]);
  els.drop.ondragover = e => { e.preventDefault(); if (!els.file.disabled) els.drop.classList.add('drag'); };
  els.drop.ondragleave = () => els.drop.classList.remove('drag');
  els.drop.ondrop = e => { e.preventDefault(); els.drop.classList.remove('drag'); if (!els.file.disabled) sendFile(e.dataTransfer.files?.[0]); };
  els.copy.onclick = async () => { try { await navigator.clipboard.writeText(roomLink()); els.copy.textContent = 'Link copied'; setTimeout(() => els.copy.textContent = 'Copy invite link', 1800); } catch { notice('Could not copy the link. Copy it from your browser address bar.'); } };
  els['new-room'].onclick = () => { if (active) { notice('Finish or cancel the current transfer first.'); return; } location.href = location.pathname; };
  setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'heartbeat' })); }, 30_000);
  connect();
})();
