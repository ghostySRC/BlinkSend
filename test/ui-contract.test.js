import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');

test('v0.3 session UX controls are present',()=>{
  for(const id of ['queue-panel','queue-list','clear-queue','post-transfer','send-another','diagnostics-panel','recent-peers','transfer-state-banner']){
    assert.match(html,new RegExp('id="'+id+'"'));
  }
});
test('queue, diagnostics, and reconnect state handlers are wired',()=>{
  assert.match(app,/function renderQueue\(/);
  assert.match(app,/function updateDiagnostics\(/);
  assert.match(app,/reconnectBanner/);
  assert.match(app,/send-another/);
  assert.match(app,/blinksend-recent-peers/);
});
