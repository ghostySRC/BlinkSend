import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { server, rooms } from '../server.js';
import { createHmac } from 'node:crypto';

test('serves the app and pairs only two browsers, forwarding signaling and peer departure', async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const url = `ws://127.0.0.1:${port}/signal`;
  const sockets = [];
  function connect() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url); sockets.push(ws);
      ws.once('open', () => resolve(ws)); ws.once('error', reject);
    });
  }
  function next(ws) {
    return new Promise((resolve, reject) => {
      ws.once('message', data => resolve(JSON.parse(data)));
      ws.once('error', reject);
    });
  }
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /BlinkSend/);
    const health = await fetch(`http://127.0.0.1:${port}/health`);
    assert.deepEqual(await health.json(), { status: 'ok' });
    const iceResponse = await fetch(`http://127.0.0.1:${port}/ice`);
    assert.deepEqual((await iceResponse.json()).iceServers, [{ urls: 'stun:stun.l.google.com:19302' }]);
    process.env.TURN_URLS = 'turn:relay.example.org:3478,turns:relay.example.org:5349';
    process.env.TURN_SECRET = 'test-secret';
    const iceWithRelay = await fetch(`http://127.0.0.1:${port}/ice`);
    const turn = (await iceWithRelay.json()).iceServers[1];
    assert.deepEqual(turn.urls, ['turn:relay.example.org:3478', 'turns:relay.example.org:5349']);
    assert.equal(turn.credential, createHmac('sha1', 'test-secret').update(turn.username).digest('base64'));
    delete process.env.TURN_URLS; delete process.env.TURN_SECRET;
    const qr = await fetch(`http://127.0.0.1:${port}/qr?url=${encodeURIComponent(`http://127.0.0.1:${port}/#${'a'.repeat(32)}`)}`);
    assert.equal(qr.status, 200);
    assert.match(await qr.text(), /<svg/);
    const unrelatedQR = await fetch(`http://127.0.0.1:${port}/qr?url=${encodeURIComponent(`https://other.example/#${'a'.repeat(32)}`)}`);
    assert.equal(unrelatedQR.status, 400);
    await assert.rejects(new Promise((resolve, reject) => {
      const foreign = new WebSocket(url, { origin: 'https://other.example' });
      foreign.once('open', resolve); foreign.once('error', reject);
    }), /403/);
    const room = 'a'.repeat(32);
    const first = await connect();
    const firstJoin = next(first); first.send(JSON.stringify({ type: 'join', room }));
    assert.deepEqual(await firstJoin, { type: 'joined', count: 1 });
    const second = await connect();
    const secondJoin = next(second), peerJoined = next(first);
    second.send(JSON.stringify({ type: 'join', room }));
    assert.deepEqual(await secondJoin, { type: 'joined', count: 2 });
    assert.deepEqual(await peerJoined, { type: 'peer-joined' });
    const forwarded = next(second);
    first.send(JSON.stringify({ type: 'offer', payload: { type: 'offer', sdp: 'test' } }));
    assert.deepEqual(await forwarded, { type: 'offer', payload: { type: 'offer', sdp: 'test' } });
    const third = await connect();
    const full = next(third); third.send(JSON.stringify({ type: 'join', room }));
    assert.deepEqual(await full, { type: 'full' });
    const left = next(first); second.close();
    assert.deepEqual(await left, { type: 'peer-left' });
  } finally {
    for (const ws of sockets) ws.terminate();
    await new Promise(resolve => server.close(resolve));
    rooms.clear();
  }
});
