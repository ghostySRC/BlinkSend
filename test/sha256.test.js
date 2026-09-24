import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('streaming SHA-256 matches standard vectors across chunk boundaries', async () => {
  const source = await readFile(new URL('../public/sha256.js', import.meta.url), 'utf8');
  const context = { window: {} }; vm.createContext(context); vm.runInContext(source, context);
  const SHA256 = context.window.BlinkSHA256;
  const empty = new SHA256(); assert.equal(empty.hex(), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const abc = new SHA256(); abc.update(new TextEncoder().encode('a')); abc.update(new TextEncoder().encode('bc'));
  assert.equal(abc.hex(), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  const long = new SHA256(); const bytes = new TextEncoder().encode('The quick brown fox jumps over the lazy dog');
  for (const byte of bytes) long.update(Uint8Array.of(byte));
  assert.equal(long.hex(), 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');
});