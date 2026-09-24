import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('browser scripts parse cleanly', async () => {
  for (const file of ['app.js', 'persistence.js', 'sha256.js', 'protocol.js', 'sw.js']) {
    const source = await readFile(new URL(`../public/${file}`, import.meta.url), 'utf8');
    assert.doesNotThrow(() => new vm.Script(source, { filename: file }));
  }
});
