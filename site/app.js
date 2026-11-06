import { filterEntries } from './catalog.mjs';
const data = JSON.parse(document.getElementById('catalog-data').textContent);
const $ = id => document.getElementById(id);
const categories = [...new Set(data.entries.map(e => e.category))];
const owners = [...new Set(data.entries.map(e => e.owner))].sort((a,b) => a.localeCompare(b));
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key,value) { try { localStorage.setItem(key,value); return true; } catch { return false; } }
};
const ids = new Set(data.entries.map(e => e.id));
function readSaved() {
  try { const value = JSON.parse(storage.get('goose-saved') || '[]'); return new Set(Array.isArray(value) ? value.filter(id => ids.has(id)) : []); }
  catch { return new Set(); }
}
let saved = readSaved();
let toastTimer;
function toast(message) {
  $('toast').textContent = message; $('toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5000);
}
function readState() {
  const p = new URLSearchParams(location.search);
  return {q:p.get('q') || '', category:categories.includes(p.get('category')) ? p.get('category') : '', owner:owners.includes(p.get('owner')) ? p.get('owner') : '', saved:p.get('saved') === '1', sort:['category','name','owner'].includes(p.get('sort')) ? p.get('sort') : 'category'};
}
let state = readState();
function viewUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q',state.q);
  if (state.category) p.set('category',state.category);
  if (state.owner) p.set('owner',state.owner);
  if (state.saved) p.set('saved','1');
  if (state.sort !== 'category') p.set('sort',state.sort);
  return location.pathname + (p.size ? '?' + p : '') + location.hash;
}
function rememberView() { try { sessionStorage.setItem('goose-directory-query',location.search); } catch {} }
function change(patch, {push=true, focus=null}={}) {
  state = {...state,...patch};
  const url=viewUrl();
  if (url !== location.pathname + location.search + location.hash) history[push ? 'pushState' : 'replaceState'](null,'',url);
  render(); if (focus) $(focus).focus();
}
function el(tag,className,text) { const node=document.createElement(tag); if(className) node.className=className; if(text!==undefined) node.textContent=text; return node; }
function link(label,href,className) { const node=el('a',className,label); node.href=href; return node; }
function card(entry) {
  const article=el('article','card');
  const top=el('div','card-top');
  const heading=el('h4'); const title=link(entry.name,entry.url,'card-title');
  title.append(el('span','out-arrow','↗')); heading.append(title); top.append(heading);
  const button=el('button','save-button',saved.has(entry.id)?'♥':'♡');
  button.type='button'; button.dataset.entry=entry.id;
  button.setAttribute('aria-label',`${saved.has(entry.id)?'Unsave':'Save'} ${entry.label}`);
  button.setAttribute('aria-pressed',String(saved.has(entry.id)));
  button.addEventListener('click',() => {
    const index=[...$('results').querySelectorAll('.save-button')].indexOf(button);
    saved.has(entry.id)?saved.delete(entry.id):saved.add(entry.id);
    const persisted=storage.set('goose-saved',JSON.stringify([...saved]));
    if(state.saved) {
      render(); const remaining=$('results').querySelectorAll('.save-button');
      (remaining[Math.min(index,remaining.length-1)] || $('saved-resources')).focus();
    } else {
      button.textContent=saved.has(entry.id)?'♥':'♡';
      button.setAttribute('aria-pressed',String(saved.has(entry.id)));
      button.setAttribute('aria-label',`${saved.has(entry.id)?'Unsave':'Save'} ${entry.label}`);
      $('saved-count').textContent=saved.size;
    }
    toast(persisted ? (saved.has(entry.id)?'Saved on this device.':'Removed from saved resources.') : 'Saved for this visit. Browser storage is unavailable.');
  });
  top.append(button); article.append(top,el('div','owner',entry.owner));
  const description=el('p','card-description'); description.innerHTML=entry.descriptionHtml; article.append(description);
  const foot=el('div','card-foot'); foot.append(el('span','license',entry.license || 'Community resource'));
  if(entry.choice) foot.append(link('Choice notes →',entry.choice));
  article.append(foot);
  const details=el('details','review-details');
  const summary=el('summary','', 'Source & review'); summary.setAttribute('aria-label',`Source and review for ${entry.label}`);
  const evidence=el('div','evidence');
  evidence.append(el('div','',`${entry.source ? 'Source reviewed' : 'Listed'} ${entry.reviewed}`));
  if(entry.source) { evidence.append(link(`Source snapshot · ${entry.commit.slice(0,7)} ↗`,entry.source),el('br')); }
  evidence.append(link('Curation policy →','CURATION.html'));
  details.append(summary,evidence); article.append(details); return article;
}
function activeFilters() {
  const container=$('filter-state'); container.replaceChildren();
  const chips=[['q',state.q&&`Search: ${state.q}`],['category',state.category],['owner',state.owner&&`Maintainer: ${state.owner}`]];
  for(const [key,label] of chips) {
    if(!label) continue;
    const button=el('button','filter-chip',label); button.type='button'; button.append(el('span','','×'));
    button.setAttribute('aria-label',`Remove ${label} filter`);
    button.addEventListener('click',() => change({[key]:''},{focus:'results-heading'})); container.append(button);
  }
}
function render() {
  $('search').value=state.q; $('owner').value=state.owner; $('sort').value=state.sort; $('category').value=state.category;
  $('saved-count').textContent=saved.size;
  $('all-resources').classList.toggle('active',!state.saved);
  $('saved-resources').classList.toggle('active',state.saved);
  $('all-resources').setAttribute('aria-pressed',String(!state.saved)); $('saved-resources').setAttribute('aria-pressed',String(state.saved));
  for(const button of $('categories').children) { const active=button.dataset.category===state.category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }
  const entries=filterEntries(data.entries,state,saved);
  entries.sort((a,b) => (state.sort==='owner'?a.owner.localeCompare(b.owner):state.sort==='category'?categories.indexOf(a.category)-categories.indexOf(b.category):0) || a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
  $('results-heading').firstChild.textContent=(state.saved?'Saved resources':state.category || (state.q?'Search results':'All resources'))+' ';
  $('result-count').textContent=state.saved?`(${entries.length} of ${saved.size})`:`(${entries.length})`;
  $('jump-results').textContent=`${entries.length} results ↓`;
  $('status').textContent=`${entries.length} ${state.saved?'matching saved ':''}resources found${state.category?' in '+state.category:''}.`;
  $('empty').hidden=entries.length!==0;
  const filtering=Boolean(state.q || state.category || state.owner);
  $('reset').disabled=!filtering && state.sort==='category';
  $('starter').hidden=filtering || state.saved;
  $('saved-help').hidden=!state.saved;
  $('filter-options-label').textContent = 'More filters' + (state.owner || state.sort!=='category' ? ' · active' : '');
  if(state.saved && saved.size===0) {
    $('empty-title').textContent='Nothing saved yet';
    $('empty-copy').textContent='Use the heart on a resource to save it here. Your collection stays on this device.';
    $('empty-reset').textContent='Browse all resources';
  } else if(state.saved) {
    $('empty-title').textContent='No saved resources match these filters';
    $('empty-copy').textContent=`You have ${saved.size} saved ${saved.size===1?'resource':'resources'}. Clear the filters to see your collection.`;
    $('empty-reset').textContent='Clear filters in saved';
  } else {
    $('empty-title').textContent='No resources match these filters';
    $('empty-copy').textContent='Try another search or clear the filters to browse all resources.';
    $('empty-reset').textContent='Clear filters';
  }
  activeFilters();
  const fragment=document.createDocumentFragment(), groups=new Map();
  for(const entry of entries) { const group=state.sort==='category'?entry.category:state.sort==='owner'?entry.owner:'Resources A–Z'; if(!groups.has(group)) groups.set(group,[]); groups.get(group).push(entry); }
  for(const [name,group] of groups) {
    const section=el('section','resource-group'),title=el('h3','group-title',name);
    title.append(el('span','group-count',String(group.length))); section.append(title);
    const cards=el('div','cards'); for(const entry of group) cards.append(card(entry)); section.append(cards); fragment.append(section);
  }
  $('results').replaceChildren(fragment); rememberView();
}
function clearFilters() { change({q:'',category:'',owner:'',sort:'category'}); }
function browseAll() { change({q:'',category:'',owner:'',saved:false,sort:'category'}); }
for(const category of categories) {
  const button=el('button','nav-item'); button.type='button'; button.dataset.category=category;
  button.append(el('span','',category),el('span','count',String(data.entries.filter(e=>e.category===category).length)));
  button.addEventListener('click',() => change({category:state.category===category?'':category})); $('categories').append(button);
  const option=el('option','',category); option.value=category; $('category').append(option);
}
for(const owner of owners) { const option=el('option','',owner); option.value=owner; $('owner').append(option); }
$('all-count').textContent=data.entries.length; $('resource-total').textContent=`${data.entries.length} resources`;
$('review-date').textContent=`Last curated ${data.reviewed}`;
$('search').addEventListener('input',e=>change({q:e.target.value},{push:false}));
for(const key of ['owner','sort','category']) $(key).addEventListener('change',e=>change({[key]:e.target.value}));
$('all-resources').addEventListener('click',browseAll);
$('saved-resources').addEventListener('click',()=>change({saved:!state.saved}));
$('reset').addEventListener('click',clearFilters);
$('empty-reset').addEventListener('click',()=> { if(state.saved && !saved.size) browseAll(); else clearFilters(); $('results-heading').focus(); });
for(const example of document.querySelectorAll('.search-example')) example.addEventListener('click',()=>change({q:example.dataset.query,category:'',owner:'',saved:false},{focus:'search'}));
$('share').addEventListener('click',async()=> {
  const url=new URL(location.href); url.searchParams.delete('saved'); url.hash='';
  try { await navigator.clipboard.writeText(url.href); toast(state.saved?'Filters link copied. Your device-local saved collection is not included.':'Filters link copied.'); }
  catch { toast('Copy the address-bar URL to share filters. Saved items stay on this device.'); }
});
document.addEventListener('keydown',e=> {
  const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
  if((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')) { e.preventDefault(); $('search').focus(); }
  if(e.key==='Escape' && document.activeElement===$('search')) { e.preventDefault(); change({q:''},{push:false}); }
});
window.addEventListener('popstate',()=>{ state=readState(); render(); });
window.addEventListener('storage',event=>{ if(event.key==='goose-saved') { saved=readSaved(); render(); } });
const mobileLayout = matchMedia('(max-width: 760px)');
function updateFilterLayout() { $('filter-options').open = !mobileLayout.matches; }
mobileLayout.addEventListener('change', updateFilterLayout);
updateFilterLayout();
render();
