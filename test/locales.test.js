import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const start=appSource.indexOf('const translations = ')+21;
const end=appSource.indexOf('\n};',start)+2;
const base=JSON.parse(appSource.slice(start,end)).en;
const baseKeys=Object.keys(base).sort();
const placeholders=value=>[...String(value).matchAll(/%([a-z]+)%/g)].map(match=>match[1]).sort();

async function loadLocales(){
  const context={window:{}};vm.createContext(context);
  vm.runInContext(await readFile(new URL('../public/locales.js',import.meta.url),'utf8'),context);
  const dir=new URL('../public/locales/',import.meta.url);
  for(const name of (await readdir(dir)).filter(name=>name.endsWith('.js')).sort()){
    vm.runInContext(await readFile(new URL(name,dir),'utf8'),context);
  }
  return context.window;
}

test('every shipped locale is complete and preserves interpolation placeholders',async()=>{
  const window=await loadLocales();
  for(const [code,pack] of Object.entries(window.BlinkLocalePacks)){
    assert.deepEqual(Object.keys(pack).sort(),baseKeys,code+' key set');
    for(const key of baseKeys){
      assert.ok(String(pack[key]).trim(),code+':'+key+' is empty');
      assert.deepEqual(placeholders(pack[key]),placeholders(base[key]),code+':'+key+' placeholders');
    }
  }
});

test('browser locale resolver picks supported languages and falls back safely',async()=>{
  const window=await loadLocales(),resolve=window.BlinkLocaleMeta.resolve;
  assert.equal(resolve(['es-MX']),'es');
  assert.equal(resolve(['pt-BR']),'pt');
  assert.equal(resolve(['zh-CN']),'zh');
  assert.equal(resolve(['ar-SA']),'ar');
  assert.equal(resolve(['pl-PL']),'en');
  assert.equal(resolve(['zh-TW']),'en');
  assert.equal(resolve(['xx-YY','fr-CA']),'fr');
});
