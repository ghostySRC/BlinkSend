import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('PWA manifest is valid and share target remains local',async()=>{const data=JSON.parse(await readFile(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));assert.equal(data.display,'standalone');assert.equal(data.share_target.action,'/share-target');assert.equal(data.share_target.method,'POST');assert.ok(data.icons.length);});