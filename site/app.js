import { filterEntries } from './catalog.mjs';
'use strict';
const data = JSON.parse(document.getElementById('catalog-data').textContent);
const $ = id => document.getElementById(id);
const categories = [...new Set(data.entries.map(e => e.category))];
const owners = [...new Set(data.entries.map(e => e.owner))].sort((a,b) => a.localeCompare(b));
const safeStorage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
};
let saved;
try { const value = JSON.parse(safeStorage.get('goose-saved') || '[]'); saved = new Set(Array.isArray(value) ? value.filter(x => typeof x === 'string') : []); } catch { saved = new Set(); }
const ids = new Set(data.entries.map(e => e.id));
saved = new Set([...saved].filter(id => ids.has(id)));
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 2600); }
function readState() {
  const p = new URLSearchParams(location.search);
  return { q: p.get('q') || '', category: categories.includes(p.get('category')) ? p.get('category') : '', owner: owners.includes(p.get('owner')) ? p.get('owner') : '', saved: p.get('saved') === '1', sort: ['category','name','owner'].includes(p.get('sort')) ? p.get('sort') : 'category' };
}
let state = readState();
function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.category) p.set('category', state.category);
  if (state.owner) p.set('owner', state.owner);
  if (state.saved) p.set('saved', '1');
  if (state.sort !== 'category') p.set('sort', state.sort);
  const query = p.toString();
  history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
}

function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function makeLink(label, href, className) { const node = el('a', className, label); node.href = href; return node; }
function card(entry) {
  const article = el('article', 'card');
  const top = el('div', 'card-top');
  const heading = el('h4'); heading.style.margin = '0';
  const link = makeLink(entry.name, entry.url, 'card-title'); link.append(el('span','out-arrow','↗')); heading.append(link); top.append(heading);
  const button = el('button','save-button',saved.has(entry.id) ? '♥' : '♡');
  button.type = 'button'; button.setAttribute('aria-label', `${saved.has(entry.id) ? 'Unsave' : 'Save'} ${entry.label}`); button.setAttribute('aria-pressed', String(saved.has(entry.id)));
  button.addEventListener('click', () => {
    saved.has(entry.id) ? saved.delete(entry.id) : saved.add(entry.id);
    const persisted = safeStorage.set('goose-saved',JSON.stringify([...saved]));
    if (state.saved) {
      const previousIndex = [...$('results').querySelectorAll('.save-button')].indexOf(button);
      render();
      const remaining = $('results').querySelectorAll('.save-button');
      (remaining[Math.min(previousIndex, remaining.length - 1)] || $('saved-resources')).focus();
    } else {
      button.textContent = saved.has(entry.id) ? '♥' : '♡';
      button.setAttribute('aria-pressed',String(saved.has(entry.id)));
      button.setAttribute('aria-label',`${saved.has(entry.id) ? 'Unsave' : 'Save'} ${entry.label}`);
      $('saved-count').textContent = saved.size;
    }
    toast(persisted ? (saved.has(entry.id) ? 'Saved on this device.' : 'Removed from saved resources.') : 'Saved for this visit. Browser storage is unavailable.');
  });
  top.append(button); article.append(top,el('div','owner',entry.owner));
  const description = el('p','card-description'); description.innerHTML = entry.descriptionHtml; article.append(description);
  const foot = el('div','card-foot'); foot.append(el('span','license',entry.license || 'Community resource'));
  const details = el('details'); const summary = el('summary','', 'Review notes'); details.append(summary);
  foot.append(details); article.append(foot);
  // Keep the disclosure content outside the horizontal footer using a separate panel.
  const evidence = el('div','evidence'); evidence.hidden = true;
  evidence.append(el('div','',`Reviewed ${entry.reviewed}`));
  if (entry.source) evidence.append(makeLink(`Read source snapshot · ${entry.commit.slice(0,7)} ↗`,entry.source),el('br'));
  evidence.append(makeLink('How and why we curate →','CHOICES.html'));
  details.addEventListener('toggle', () => { evidence.hidden = !details.open; });
  article.append(evidence); return article;
}
function render() {
  $('search').value = state.q; $('owner').value = state.owner; $('sort').value = state.sort;
  $('saved-count').textContent = saved.size;
  $('all-resources').classList.toggle('active', !state.saved && !state.category);
  $('saved-resources').classList.toggle('active',state.saved);
  $('all-resources').setAttribute('aria-pressed',String(!state.saved && !state.category));
  $('saved-resources').setAttribute('aria-pressed',String(state.saved));
  for (const button of $('categories').children) { const active = button.dataset.category === state.category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }
  const entries = filterEntries(data.entries,state,saved);
  entries.sort((a,b) => (state.sort === 'owner' ? a.owner.localeCompare(b.owner) : state.sort === 'category' ? categories.indexOf(a.category)-categories.indexOf(b.category) : 0) || a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
  $('results-heading').firstChild.textContent = (state.saved ? 'Saved for later' : state.category || (state.q ? 'Search results' : 'All resources')) + ' ';
  $('result-count').textContent = `(${entries.length})`;
  $('status').textContent = `${entries.length} resources found${state.category ? ' in ' + state.category : ''}.`;
  $('empty').hidden = entries.length !== 0;
  const fragment = document.createDocumentFragment();
  const groups = new Map();
  for (const entry of entries) {
    const group = state.sort === 'category' ? entry.category : state.sort === 'owner' ? entry.owner : 'Resources A–Z';
    if (!groups.has(group)) groups.set(group,[]);
    groups.get(group).push(entry);
  }
  for (const [name, group] of groups) {
    const section = el('section','resource-group'); const title = el('h3','group-title',name); title.append(el('span','group-count',String(group.length))); section.append(title);
    const cards = el('div','cards'); for (const entry of group) cards.append(card(entry)); section.append(cards); fragment.append(section);
  }
  $('results').replaceChildren(fragment); syncUrl();
}
function reset() { state = {q:'',category:'',owner:'',saved:false,sort:'category'}; render(); }
for (const category of categories) {
  const button = el('button','nav-item'); button.type='button'; button.dataset.category=category;
  button.append(el('span','',category),el('span','count',String(data.entries.filter(e => e.category===category).length)));
  button.addEventListener('click',() => { state.category = state.category===category ? '' : category; state.saved=false; render(); }); $('categories').append(button);
}
for (const owner of owners) { const option = el('option','',owner); option.value=owner; $('owner').append(option); }
$('all-count').textContent = data.entries.length;
$('resource-total').textContent = `${data.entries.length} useful resources`;
$('review-date').textContent = `Last curated ${data.reviewed}`;
$('search').addEventListener('input',e => { state.q=e.target.value; render(); });
$('owner').addEventListener('change',e => { state.owner=e.target.value; render(); });
$('sort').addEventListener('change',e => { state.sort=e.target.value; render(); });
$('all-resources').addEventListener('click',reset);
$('saved-resources').addEventListener('click',() => { state.saved=!state.saved; state.category=''; render(); });
for (const id of ['reset','empty-reset']) $(id).addEventListener('click',reset);
for (const example of document.querySelectorAll('.search-example')) example.addEventListener('click',() => { reset(); state.q=example.dataset.query; render(); $('search').focus(); });
$('share').addEventListener('click',async () => { try { await navigator.clipboard.writeText(location.href); toast('View link copied.'); } catch { toast('Copy the URL from your address bar to share this view.'); } });
function setTheme(theme) { document.documentElement.dataset.theme=theme; $('theme').setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} theme`); }
setTheme(safeStorage.get('goose-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
$('theme').addEventListener('click',() => { const theme=document.documentElement.dataset.theme==='dark'?'light':'dark'; setTheme(theme); safeStorage.set('goose-theme',theme); });
document.addEventListener('keydown',e => { const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable; if ((e.key==='/' && !typing) || ((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')) { e.preventDefault(); $('search').focus(); } if(e.key==='Escape' && document.activeElement===$('search')) { state.q=''; render(); $('search').blur(); } });
window.addEventListener('popstate',() => { state=readState(); render(); });
render();
