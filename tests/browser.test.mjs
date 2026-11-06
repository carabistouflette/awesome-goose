import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const mount='/awesome-goose';
const output=resolve(fileURLToPath(new URL('../_site',import.meta.url)));
const inventory=JSON.parse(await readFile(new URL('../docs/sources.json',import.meta.url),'utf8'));
const catalog=JSON.parse(await readFile(new URL('../_site/catalog.json',import.meta.url),'utf8'));
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json'};
let server,browser,base;
before(async()=>{
  server=createServer(async(request,response)=>{
    try {
      const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      if(!pathname.startsWith(mount+'/')) throw new Error('Outside Pages base');
      const path=pathname.slice(mount.length);
      const file=resolve(output,'.'+(path==='/'?'/index.html':path));
      if(!file.startsWith(output+sep)) throw new Error('Outside build');
      const content=await readFile(file);
      response.writeHead(200,{'content-type':mime[extname(file)] || 'application/octet-stream','cache-control':'no-store'});response.end(content);
    } catch {response.writeHead(404);response.end('Not found');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  base=`http://127.0.0.1:${server.address().port}${mount}`;
  browser=await chromium.launch({headless:true,executablePath:process.env.AWESOME_GOOSE_BROWSER_PATH || undefined,args:['--no-sandbox']});
});
after(async()=>{await browser?.close();if(server) await new Promise(resolve=>server.close(resolve));});
async function directory(page,query='') {
  await page.goto(base+'/'+query);
  await page.waitForFunction(()=>document.querySelector('#status').textContent.length>0);
}
async function withinViewport(page) {
  const geometry=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,row:document.querySelector('.results-title')?.getBoundingClientRect().right}));
  assert.ok(geometry.document<=geometry.viewport,JSON.stringify(geometry));
  if(geometry.row) assert.ok(geometry.row<=geometry.viewport,JSON.stringify(geometry));
}

test('long narrow queries keep both closed and open filter context inside the page',async()=>{
  const context=await browser.newContext();
  try {
    const page=await context.newPage();
    for(const width of [320,360,390]) {
      await page.setViewportSize({width,height:740});
      for(const q of ['goose sqlite bounded linux dependencies search long question','carabistouflette/goose-http','W'.repeat(100),'🪿'.repeat(40)]) {
        await directory(page,'?'+new URLSearchParams({q,owner:'kaitk',category:'Databases',sort:'name'}));
        await withinViewport(page);
        await page.locator('#scope-summary').click();
        await withinViewport(page);
        assert.ok((await page.locator('#scope-values').textContent()).includes(q));
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(()=>document.activeElement.id),'scope-summary');
      }
    }
  } finally {await context.close();}
});

test('full requirement context can be inspected, edited and cleared with useful focus',async()=>{
  const context=await browser.newContext({viewport:{width:320,height:740}});
  try {
    const page=await context.newPage();
    await directory(page,'?q=sqlite&category=Databases&owner=carabistouflette&implementation=native&platform=linux&sort=name');
    assert.equal(await page.locator('#results-heading').textContent(),'1 match');
    await page.locator('#scope-summary').click();
    const values=await page.locator('#scope-values').textContent();
    for(const value of ['sqlite','Databases','carabistouflette','native / SDK note','Linux note','Name A–Z']) assert.ok(values.includes(value),value);
    await page.locator('#scope-edit').click();
    assert.deepEqual(await page.evaluate(()=>({id:document.activeElement.id,selection:document.activeElement.selectionEnd-document.activeElement.selectionStart})),{id:'search',selection:6});
    assert.equal(await page.locator('#implementation').inputValue(),'native');
    assert.equal(await page.locator('#platform').inputValue(),'linux');
    await page.locator('#toolbar-apply').click();
    await page.locator('#scope-summary').click();
    await page.locator('#scope-clear').click();
    assert.equal(new URL(page.url()).search,'');
    assert.equal(await page.locator('#jump-results').textContent(),`${catalog.entries.length} ↓`);
    await withinViewport(page);
  } finally {await context.close();}
});

test('repository evidence lookup restores its URL and clears back to the full inventory',async()=>{
  const context=await browser.newContext({viewport:{width:320,height:740}});
  try {
    const page=await context.newPage();
    await page.goto(base+'/SOURCES.html');
    const repository='carabistouflette/goose-http';
    await page.locator('#source-search').fill(repository);
    assert.equal(await page.locator('tbody tr:visible').count(),1);
    assert.equal(new URL(page.url()).searchParams.get('repo'),repository);
    await page.reload();
    assert.equal(await page.locator('#source-search').inputValue(),repository);
    assert.equal(await page.locator('tbody tr:visible').count(),1);
    await page.locator('#source-search-clear').click();
    assert.equal(await page.locator('tbody tr:visible').count(),inventory.repositories.length);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'source-search');
    await withinViewport(page);
  } finally {await context.close();}
});

test('selecting Saved repeatedly preserves the collection across reload',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  try {
    const page=await context.newPage();
    await directory(page);
    await page.locator('.save-button:visible').first().click();
    await page.locator('#saved-resources').click();
    await page.locator('#saved-resources').click();
    assert.equal(await page.locator('#saved-resources').getAttribute('aria-pressed'),'true');
    await page.reload();
    assert.equal(await page.locator('#saved-resources').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('.card').count(),1);
  } finally {await context.close();}
});

test('bundled assets, guide anchors, theme and directory return work below the Pages base',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:'light'});
  try {
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
    await directory(page,'?q=sqlite&sort=name&view=cards');
    await page.locator('[data-theme-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    await page.locator('a[href="CHOICES.html#sqlite"]').first().click();
    assert.equal(new URL(page.url()).pathname,mount+'/CHOICES.html');
    await page.waitForFunction(()=>document.querySelector('#sqlite') && document.querySelector('[data-directory-return]').href.includes('q=sqlite'));
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    assert.ok((await page.locator('#sqlite').boundingBox()).y>=0);
    assert.ok(await page.locator('.table-wrap td[data-label="Qualification"]').count()>0);
    for(const width of [320,834,1440]) {
      await page.setViewportSize({width,height:900});
      await withinViewport(page);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.guide-mobile-nav [data-directory-return]').click();
    assert.equal(new URL(page.url()).pathname,mount+'/');
    assert.equal(await page.locator('#search').inputValue(),'sqlite');
    assert.equal(await page.locator('#sort').inputValue(),'name');
    assert.equal(await page.locator('#cards-view').getAttribute('aria-pressed'),'true');
    await withinViewport(page);
    assert.deepEqual(errors,[]);
  } finally {await context.close();}
});
