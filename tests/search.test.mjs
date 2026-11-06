import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterEntries, shareUrl, categoryCounts, sortEntries, searchMatch } from '../site/catalog.mjs';
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

test('share links omit device-local saved mode and preserve public filters and layout',() => {
  const url = new URL(shareUrl('https://example.com/awesome-goose/?q=sqlite&category=Databases&saved=1&view=cards&implementation=native&platform=linux#directory'));
  assert.equal(url.searchParams.has('saved'),false);
  assert.equal(url.hash,'');
  assert.equal(url.searchParams.get('q'),'sqlite');
  assert.equal(url.searchParams.get('category'),'Databases');
  assert.equal(url.searchParams.get('view'),'cards');
  assert.equal(url.searchParams.get('implementation'),'native');
  assert.equal(url.searchParams.get('platform'),'linux');
});

test('category counts reflect search, maintainer and saved state without applying the current category',()=>{
  const filters={...base,q:'sqlite',owner:'kaitk',category:'Graphics'};
  const counts=categoryCounts(entries,filters,new Set());
  assert.equal(counts.get('Databases'),1);
  assert.equal(counts.get('Graphics'),0);
  const savedId=entries.find(e=>e.repository==='carabistouflette/goose-sqlite').id;
  assert.equal(categoryCounts(entries,{...base,saved:true},new Set([savedId])).get('Databases'),1);
});

test('name sorting follows package names across maintainers and groups identical names',()=>{
  const categories=[...new Set(entries.map(e=>e.category))];
  const sorted=sortEntries(entries,'name',categories);
  assert.equal(sorted[0].name,'coc-goose');
  const http=sorted.map((entry,index)=>({entry,index})).filter(({entry})=>entry.name==='goose-http');
  assert.equal(http.length,2);
  assert.equal(http[1].index,http[0].index+1);
  assert.equal(http[0].entry.owner,'carabistouflette');
  const byOwner=sortEntries(entries,'owner',categories);
  assert.equal(byOwner[0].owner,'aardappel');
  assert.equal(byOwner.at(-1).owner,'ZHENGSY');
});

test('common topic vocabulary retrieves complete alternatives and retains AND filters',()=>{
  const repos=query=>search({q:query}).map(e=>e.repository).sort();
  const compression=['carabistouflette/goose-archive','kaitk/goose-compress','Macho0x/goose-deflate'].sort();
  assert.deepEqual(repos('compression'),compression);
  assert.deepEqual(repos('compress'),compression);
  const logging=['carabistouflette/goose-log','Macho0x/goose-logger'].sort();
  assert.deepEqual(repos('logging'),logging);
  assert.deepEqual(repos('logger'),logging);
  assert.deepEqual(repos('compression Macho0x'),['Macho0x/goose-deflate']);
  assert.ok(search({q:'math'}).length>0);
  assert.ok(search({q:'CLI'}).some(e=>e.repository==='carabistouflette/goose-argparse'));
});
test('UTF-8 punctuation variants find the same two documented entries',()=>{
  const expected=['carabistouflette/goose-text','Macho0x/goose-msgpack'].sort();
  for(const q of ['utf8','UTF-8','utf 8']) assert.deepEqual(search({q}).map(e=>e.repository).sort(),expected);
});

test('word-prefix search avoids incidental native inside alternative',()=>{
  const fixture=[{id:'alternative',label:'Alternative runtime',name:'runtime',owner:'sample',category:'Example',description:'Another backend'}, {id:'native',label:'Bindings',name:'bindings',owner:'sample',category:'Example',description:'Native-backed helper'}];
  assert.deepEqual(filterEntries(fixture,{...base,q:'native'},new Set()).map(e=>e.id),['native']);
  assert.ok(search({q:'libcurl'}).some(e=>e.repository==='carabistouflette/goose-http'));
});

test('decompression aliases find the decoder before an explicit encoder-only limitation',()=>{
  const categories=[...new Set(entries.map(entry=>entry.category))];
  for(const q of ['decompression','decompress','decoder']) {
    const results=sortEntries(search({q}),'category',categories,q);
    const decoder=results.findIndex(entry=>entry.repository==='Macho0x/goose-deflate');
    const encoder=results.findIndex(entry=>entry.repository==='kaitk/goose-compress');
    assert.ok(decoder>=0 && encoder>decoder,q);
    assert.equal(searchMatch(results[decoder],q).limitation,'');
    assert.match(searchMatch(results[encoder],q).limitation,/no decoder/);
  }
});
test('capability limitations remain discoverable behind positive matches',()=>{
  const categories=[...new Set(entries.map(entry=>entry.category))];
  const results=sortEntries(search({q:'utf8'}),'category',categories,'utf8');
  assert.equal(results[0].repository,'carabistouflette/goose-text');
  assert.equal(results[1].repository,'Macho0x/goose-msgpack');
  assert.match(searchMatch(results[1],'utf8').limitation,/without UTF-8 validation/);
  assert.ok(search({q:'native'}).some(entry=>entry.repository==='carabistouflette/goose-http'));
});

test('recorded requirements combine with category, owner, query and platform-note filters',()=>{
  const result=search({q:'http',owner:'carabistouflette',category:'Networking and web',implementation:'native'});
  assert.deepEqual(result.map(entry=>entry.repository),['carabistouflette/goose-http']);
  const linux=search({platform:'linux'}).map(entry=>entry.repository);
  assert.ok(linux.includes('carabistouflette/goose-sqlite'));
  assert.ok(linux.includes('kaitk/goose-ngfx'));
  const graphics=entries.find(entry=>entry.repository==='kaitk/goose-ngfx');
  assert.match(graphics.requirements.platform[0].note,/Linux presentation is unavailable/);
});
test('unknown notes stay distinct from documented implementation and platform evidence',()=>{
  assert.equal(search({q:'carabistouflette/goose-argparse',implementation:'unknown',platform:'unknown'}).length,1);
  assert.equal(search({q:'carabistouflette/goose-argparse',implementation:'native'}).length,0);
  assert.deepEqual(search({owner:'Macho0x',q:'deflate',implementation:'goose'}).map(entry=>entry.repository),['Macho0x/goose-deflate']);
  assert.equal(search({q:'robtandy/goose.go',implementation:'go'}).length,1);
});
