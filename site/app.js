import { filterEntries, shareUrl, categoryCounts, sortEntries } from './catalog.mjs';
const data = JSON.parse(document.getElementById('catalog-data').textContent);
const $ = id => document.getElementById(id);
const categoryLabels={'Command line and configuration':'CLI & configuration','Data formats and text':'Data & text','Files, processes, and artifacts':'Files & processes','Networking and web':'Networking & web','Numbers and scientific computing':'Scientific & numeric','Time and identifiers':'Time & identifiers','Development tools':'Developer tools','Learning and community':'Learning & community'};
const selectLabels={...categoryLabels,'Command line and configuration':'CLI & config','Numbers and scientific computing':'Science & maths','Ethereum and signing':'Ethereum','Time and identifiers':'Time & IDs','Learning and community':'Community'};
const categories = [...new Set(data.entries.map(e => e.category))];
const browseOrder = categories;
const owners = [...new Set(data.entries.map(e => e.owner))].sort((a,b) => a.localeCompare(b));
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key,value) { try { localStorage.setItem(key,value); return true; } catch { return false; } }
};
const referencePreferences = {};
const expandedEvidence = new Set();
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
  return {q:p.get('q') || '', category:categories.includes(p.get('category')) ? p.get('category') : '', owner:owners.includes(p.get('owner')) ? p.get('owner') : '', saved:p.get('saved') === '1', sort:['category','name','owner'].includes(p.get('sort')) ? p.get('sort') : 'category', view:p.get('view')==='cards'?'cards':'list'};
}
let state = readState();
function viewUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q',state.q);
  if (state.category) p.set('category',state.category);
  if (state.owner) p.set('owner',state.owner);
  if (state.saved) p.set('saved','1');
  if (state.sort !== 'category') p.set('sort',state.sort);
  if (state.view === 'cards') p.set('view','cards');
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
  const identity=el('div','resource-identity');
  const heading=el('h4'); const title=link('',entry.url,'card-title');
  title.setAttribute('aria-label',entry.repository || entry.label);
  if(entry.repository) { const owner=el('span','owner-prefix',entry.owner); owner.append(el('span','repo-separator',' / ')); title.append(owner); }
  title.append(document.createTextNode(entry.name));
  title.append(el('span','out-arrow','↗')); heading.append(title); identity.append(heading);
  if(!entry.repository) identity.append(el('div','owner',entry.owner));
  identity.append(el('span','license',entry.license || (entry.owner==='aardappel'?'Official language resource':'Community resource')));
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
      $('saved-resources').setAttribute('aria-label',`Saved resources (${saved.size})`);
    }
    toast(persisted ? (saved.has(entry.id)?'Saved on this device.':'Removed from saved resources.') : 'Saved for this visit. Browser storage is unavailable.');
  });
  article.append(identity);
  const overview=el('div','resource-overview');
  const description=el('p','card-description'); description.innerHTML=entry.descriptionHtml; overview.append(description);
  const foot=el('div','resource-links');
  if(entry.choice) foot.append(link((entry.choiceLabel || 'Choice notes')+' →',entry.choice));

  const details=el('details','review-details'); details.dataset.entry=entry.id; details.open=expandedEvidence.has(entry.id);
  const summary=el('summary','', 'Source & review'); summary.setAttribute('aria-label',`Source and review for ${entry.label}`);
  const evidence=el('div','evidence');
  evidence.append(el('div','',`${entry.source ? 'Source reviewed' : 'Listed'} ${entry.reviewed}`));
  if(entry.source) { evidence.append(link(`Source snapshot · ${entry.commit.slice(0,7)} ↗`,entry.source),el('br')); }
  if(entry.comparisonSource && entry.comparisonCommit!==entry.commit) { evidence.append(el('div','','The detailed comparison uses a different source snapshot.'),link(`Comparison baseline · ${entry.comparisonCommit.slice(0,7)} ↗`,entry.comparisonSource),el('br')); }
  evidence.append(link('Curation policy →','CURATION.html'));
  details.append(summary,evidence); foot.append(details); overview.append(foot); article.append(overview,button); return article;
}
function activeFilters() {
  const container=$('filter-state'); container.replaceChildren();
  const chips=[['q',state.q&&`Search: ${state.q}`],['category',state.category],['owner',state.owner&&`Maintainer: ${state.owner}`]];
  for(const [key,label] of chips) {
    if(!label) continue;
    const button=el('button','filter-chip',label); button.type='button'; button.append(el('span','','×'));
    button.setAttribute('aria-label',`Remove ${label} filter`);
    button.addEventListener('click',() => {change({[key]:''});jumpToResults();}); container.append(button);
  }
}
function render() {
  for(const details of $('results').querySelectorAll('.review-details')) details.open?expandedEvidence.add(details.dataset.entry):expandedEvidence.delete(details.dataset.entry);
  $('search').value=state.q; $('owner').value=state.owner; $('sort').value=state.sort; $('category').value=state.category;
  $('saved-count').textContent=saved.size;
  $('all-resources').setAttribute('aria-label',`All resources (${data.entries.length})`);
  $('saved-resources').setAttribute('aria-label',`Saved resources (${saved.size})`);
  $('all-resources').classList.toggle('active',!state.saved);
  $('saved-resources').classList.toggle('active',state.saved);
  $('all-resources').setAttribute('aria-pressed',String(!state.saved)); $('saved-resources').setAttribute('aria-pressed',String(state.saved));
  for(const button of $('categories').children) { const active=button.dataset.category===state.category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }
  const entries=sortEntries(filterEntries(data.entries,state,saved),state.sort,browseOrder);
  const filtering=Boolean(state.q || state.category || state.owner);
  updateFilterControls();
  $('results-heading').firstChild.textContent=(state.saved?(filtering?'Matching saved resources':'Saved resources'):(filtering?'Matching resources':'All resources'))+' ';
  $('result-count').textContent=state.saved?`(${entries.length} of ${saved.size})`:`(${entries.length})`;
  $('jump-results').textContent=`${entries.length} ↓`;
  $('jump-results').setAttribute('aria-label',`Show ${entries.length} matching ${entries.length===1?'resource':'resources'}`);
  $('jump-results').title=$('jump-results').getAttribute('aria-label');
  $('directory').dataset.view=state.view;
  $('list-view').setAttribute('aria-pressed',String(state.view==='list'));
  $('cards-view').setAttribute('aria-pressed',String(state.view==='cards'));
  $('status').textContent=`${entries.length} ${state.saved?'matching saved ':''}${entries.length===1?'resource':'resources'} found${state.category?' in '+state.category:''}.`;
  $('empty').hidden=entries.length!==0;
  const activeCount=[state.q,state.category,state.owner].filter(Boolean).length;
  $('active-filter-summary').textContent=activeCount?`${activeCount} active ${activeCount===1?'filter':'filters'}`:'';
  const counts=categoryCounts(data.entries,state,saved);
  $('category-label').textContent=(state.q || state.owner || state.saved)?'Categories · matches':'Categories';
  for(const button of $('categories').children) { const count=counts.get(button.dataset.category); button.querySelector('.count').textContent=count; button.setAttribute('aria-label',`${button.dataset.category}: ${count} matching ${count===1?'resource':'resources'}`); }
  for(const option of $('category').options) if(option.value) option.textContent=(selectLabels[option.value] || option.value)+' ('+counts.get(option.value)+')';
  $('reset').disabled=!filtering && state.sort==='category';
  $('saved-help').hidden=!state.saved;
  $('filter-options-label').textContent = 'Filters';
  $('filter-options-label').dataset.active=String(Boolean(state.owner || state.sort!=='category'));
  $('filter-options-label').setAttribute('aria-label',state.owner || state.sort!=='category'?'Filters, active':'Filters');
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
    const section=el('section','resource-group'),title=el('h3','group-title',categoryLabels[name] || name);
    title.setAttribute('aria-label',`${name}, ${group.length} ${group.length===1?'resource':'resources'}`);
    title.append(el('span','group-count',String(group.length))); section.append(title);
    if(name==='Start here' && !filtering && !state.saved && state.sort==='category') {
      section.classList.add('reference-group'); title.classList.add('sr-only');
      title.textContent='Language, documentation and examples';
      const shortcuts=el('nav','reference-shortcuts'); shortcuts.setAttribute('aria-label','Official Goose resources');
      for(const [id,label] of [['goose','Compiler'],['documentation','Docs'],['standard-library','Stdlib'],['packages','Packages'],['samples','Samples']]) {
        const entry=group.find(item=>item.id===id);
        if(entry) { const shortcut=link(label+' ↗',entry.url); shortcut.setAttribute('aria-label',label+' — '+(entry.name==='Goose'?'Goose compiler':entry.name)); shortcuts.append(shortcut); }
      }
      const disclosure=el('details','reference-details');
      const mode=matchMedia('(max-width: 760px)').matches?'mobile':'desktop';
      disclosure.open=referencePreferences[mode] ?? false;
      const summary=el('summary','',mode==='mobile'?'Compiler, docs & examples':'Details'); summary.setAttribute('aria-label',mode==='mobile'?'Compiler, docs & examples: all five language resources, including the standard library and package guide':'Details for all '+group.length+' language resources, with descriptions and save controls'); disclosure.append(summary);
      summary.addEventListener('click',()=>{referencePreferences[mode]=!disclosure.open;});
      const references=el('div','cards reference-resources');
      for(const entry of group) references.append(card(entry));
      if(mode==='mobile') section.classList.add('compact-references'); else section.append(shortcuts);
      disclosure.append(references); section.append(disclosure);
    } else {
      const cards=el('div','cards'); for(const entry of group) cards.append(card(entry)); section.append(cards);
    }
    fragment.append(section);
  }
  $('results').replaceChildren(fragment); rememberView();
}
function clearFilters() { change({q:'',category:'',owner:'',sort:'category'}); }
function browseAll() { change({q:'',category:'',owner:'',saved:false,sort:'category'}); }
for(const category of categories) {
  const button=el('button','nav-item'); button.type='button'; button.dataset.category=category;
  button.title=category;
  button.append(el('span','',categoryLabels[category] || category),el('span','count',String(data.entries.filter(e=>e.category===category).length)));
  button.addEventListener('click',() => {change({category:state.category===category?'':category});jumpToResults();}); $('categories').append(button);
  const option=el('option','',(selectLabels[category] || category)+' ('+data.entries.filter(e=>e.category===category).length+')'); option.value=category; $('category').append(option);
}
for(const owner of owners) { const option=el('option','',owner); option.value=owner; $('owner').append(option); }
$('all-count').textContent=data.entries.length;
$('review-date').textContent=`Last curated ${data.reviewed}`;
$('search').addEventListener('input',e=>change({q:e.target.value},{push:false}));
for(const key of ['owner','sort','category']) $(key).addEventListener('change',e=>change({[key]:e.target.value}));
$('all-resources').addEventListener('click',()=>{change({saved:false});jumpToResults();});
for(const view of ['list','cards']) $(view+'-view').addEventListener('click',()=>change({view}));
$('saved-resources').addEventListener('click',()=>{change({saved:!state.saved});jumpToResults();});
$('reset').addEventListener('click',()=>{clearFilters();jumpToResults();});
function jumpToResults() {
  const target=$('results').querySelector('.reference-details summary, .resource-group:not(.reference-group) .group-title') || $('empty-title');
  if(target.tagName!=='SUMMARY') target.tabIndex=-1;
  focusBelowToolbar(target);
}
function focusBelowToolbar(target,padding=12) {
  target.focus({preventScroll:true});
  const header=document.querySelector('.topbar'), toolbar=document.querySelector('.directory-top');
  const offset=toolbar.getBoundingClientRect().height+(getComputedStyle(header).position==='sticky'?header.getBoundingClientRect().height:0)+padding;
  scrollTo({top:scrollY+target.getBoundingClientRect().top-offset});
}
$('jump-results').addEventListener('click',event=>{event.preventDefault();jumpToResults();});
function closeAndShowResults() { $('filter-options').open=false; updateFilterControls(); jumpToResults(); }
$('toolbar-apply').addEventListener('click',()=>{if($('filter-options').open) closeAndShowResults(); else { $('filter-options').open=true; updateFilterControls(); focusBelowToolbar($('category'),40); }});
$('filter-options').addEventListener('toggle',updateFilterControls);
$('empty-reset').addEventListener('click',()=> { if(state.saved && !saved.size) browseAll(); else clearFilters(); jumpToResults(); });
$('share').addEventListener('click',async()=> {
  const url=shareUrl(location.href);
  try { await navigator.clipboard.writeText(url); $('share-fallback').hidden=true; toast(state.saved?'Filters link copied. Your device-local saved collection is not included.':'Filters link copied.'); }
  catch {
    $('share-url').value=url; $('share-fallback').hidden=false; $('share-url').focus(); $('share-url').select();
    toast('Clipboard access is unavailable. Copy the selected filters link.');
  }
});
$('share-close').addEventListener('click',()=>{ $('share-fallback').hidden=true; $('share').focus(); });
document.addEventListener('keydown',e=> {
  const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
  if((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')) { e.preventDefault(); $('search').focus(); }
  if(e.key==='Escape' && document.activeElement===$('search')) { e.preventDefault(); change({q:''},{push:false}); }
});
window.addEventListener('popstate',()=>{ state=readState(); render(); });
window.addEventListener('storage',event=>{ if(event.key==='goose-saved') { saved=readSaved(); render(); } });
const mobileLayout = matchMedia('(max-width: 760px)');
function updateFilterControls() {
  const open=$('filter-options').open;
  $('directory').dataset.filtersOpen=String(open);
  $('directory').dataset.context=String(Boolean(state.q || state.category || state.owner || state.saved || state.sort!=='category' || (open && matchMedia('(max-width:760px)').matches)));
  const count=[state.q,state.category,state.owner].filter(Boolean).length;
  const matches=filterEntries(data.entries,state,saved).length;
  const summary=[state.q&&`Search: ${state.q}`,state.category,state.owner&&`Maintainer: ${state.owner}`,`Sort: ${$('sort').selectedOptions[0].textContent}`].filter(Boolean).join('; ');
  $('toolbar-apply').textContent=open?`Show ${matches} ↓`:`Filters${count?' · '+count:''}`;
  $('toolbar-apply').setAttribute('aria-label',open?`Show ${matches} matching resources and close filters`:`Filters: edit ${count} active filters. ${summary}`);
  $('toolbar-apply').setAttribute('aria-expanded',String(open));
}
function updateFilterLayout() { $('filter-options').open = !mobileLayout.matches; updateFilterControls(); }
mobileLayout.addEventListener('change',()=>{updateFilterLayout();render();});
updateFilterLayout();
render();
