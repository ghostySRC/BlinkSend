import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('browser scripts parse cleanly', async () => {
  for (const file of ['app.js', 'locales.js', 'persistence.js', 'sha256.js', 'protocol.js', 'security.js', 'verification.js', 'connection.js', 'control-policy.js', 'transfer-core.js', 'storage.js', 'receive-worker.js', 'sw.js']) {
    const source = await readFile(new URL(`../public/${file}`, import.meta.url), 'utf8');
    assert.doesNotThrow(() => new vm.Script(source, { filename: file }));
  }
});
