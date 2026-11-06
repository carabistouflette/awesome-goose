import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterEntries } from '../site/catalog.mjs';
const { entries } = JSON.parse(readFileSync(new URL('../_site/catalog.json',import.meta.url)));
const base = { q:'', category:'', owner:'', saved:false };
const search = (patch, saved=new Set()) => filterEntries(entries,{...base,...patch},saved);
test('all resources are available without filters',() => assert.equal(search({}).length,entries.length));
test('multiword search is case insensitive and spans name, owner and description',() => {
  const result=search({q:'  MACHO0X ethereum  '});
  assert.ok(result.some(e=>e.repository==='Macho0x/goose-ethereum'));
  assert.ok(result.every(e=>e.owner==='Macho0x'));
});
test('owner and category filters combine with search',() => {
  const result=search({q:'sqlite',owner:'kaitk',category:'Databases'});
  assert.deepEqual(result.map(e=>e.repository),['kaitk/goose-sqlite']);
  assert.equal(search({q:'sqlite',owner:'kaitk',category:'Graphics'}).length,0);
});
test('saved filter does not leak unsaved resources',() => {
  const id=entries.find(e=>e.repository==='robtandy/goose.go').id;
  assert.deepEqual(search({saved:true},new Set([id])).map(e=>e.id),[id]);
  assert.equal(search({saved:true}).length,0);
});
test('all reader-suggested projects are discoverable',() => {
  for(const repo of ['robtandy/goose.go','voidssx1/gosh','ZHENGSY/goose-zed','exaroth/coc-goose','lamweilun/raygoose','kaitk/plod']) assert.ok(search({q:repo}).some(e=>e.repository===repo),repo);
});
test('search text is treated literally and yields an empty result',() => assert.equal(search({q:'<script>alert(1)</script>'}).length,0));
