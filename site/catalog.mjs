const categoryTopics={
  'Start here':'getting started learn language docs documentation compiler examples samples standard library stdlib',
  'Command line and configuration':'CLI command line config configuration',
  'Data formats and text':'data formats text',
  'Files, processes, and artifacts':'files filesystem processes artifacts',
  'Networking and web':'network networking web internet',
  'Databases':'database databases DB',
  'Cryptography':'crypto cryptographic cryptography',
  'Ethereum and signing':'Ethereum ETH signing',
  'Numbers and scientific computing':'math mathematics numeric numerical numbers science scientific computing',
  'Graphics':'graphics graphical',
  'Time and identifiers':'time identifiers',
  'Applications':'applications apps programs',
  'Development tools':'developer development dev tools tooling',
  'Learning and community':'learn learning community education'
};
function searchText(text) {
  return text.normalize('NFKC').toLocaleLowerCase()
    .replace(/\butf[ -]?8\b/g,'utf8')
    .replace(/\bcli\b/g,'command line')
    .replace(/\bdb\b/g,'database')
    .replace(/\b(?:logging|loggers?|logs)\b/g,'log')
    .replace(/\b(?:compression|compressing|compressed)\b/g,'compress')
    .replace(/\b(?:decompression|decompressing|decompressed)\b/g,'decompress')
    .replace(/\b(?:encoding|encoders?|encoded)\b/g,'encode')
    .replace(/\b(?:decoding|decoders?|decoded)\b/g,'decode')
    .replace(/\b(?:archives|archiving)\b/g,'archive')
    .replace(/\b(?:writing|writers?|written)\b/g,'write')
    .replace(/\b(?:parsing|parsers?|parsed)\b/g,'parse')
    .replace(/\bmaps\b/g,'map');
}
function matchesWord(text, word) {
  if(!/^\p{L}/u.test(word)) return text.includes(word);
  let index=text.indexOf(word);
  while(index>=0) {
    if(index===0 || !/[\p{L}\p{N}]/u.test(text[index-1])) return true;
    index=text.indexOf(word,index+1);
  }
  return false;
}
export function searchMatch(entry, query) {
  const words=searchText(query).trim().split(/\s+/).filter(Boolean);
  if(!words.length) return {matches:true,limitation:''};
  const cautions=entry.searchCautions || [];
  const text=searchText(`${entry.label} ${entry.owner} ${entry.category} ${categoryTopics[entry.category] || ''} ${entry.description} ${entry.choice ? entry.choiceLabel || '' : ''} ${(entry.searchAliases || []).join(' ')} ${cautions.flatMap(caution=>caution.terms).join(' ')}`);
  if(!words.every(word=>matchesWord(text,word))) return {matches:false,limitation:''};
  const notes=cautions.filter(caution=>words.some(word=>matchesWord(searchText(caution.terms.join(' ')),word))).map(caution=>caution.note);
  return {matches:true,limitation:[...new Set(notes)].join(' ')};
}
export function filterEntries(entries, filters, favorites) {
  return entries.filter(entry => (!filters.category || entry.category===filters.category) && (!filters.owner || entry.owner===filters.owner) && (!filters.saved || favorites.has(entry.id)) && searchMatch(entry,filters.q).matches);
}

export function shareUrl(href) {
  const url = new URL(href);
  url.searchParams.delete('saved');
  url.hash = '';
  return url.href;
}

export function categoryCounts(entries, filters, favorites) {
  const counts = new Map([...new Set(entries.map(e=>e.category))].map(category=>[category,0]));
  for (const entry of filterEntries(entries,{...filters,category:''},favorites)) counts.set(entry.category,counts.get(entry.category)+1);
  return counts;
}

export function sortEntries(entries, sort, categories, query='') {
  const limited=new Map(query && sort==='category'?entries.map(entry=>[entry.id,Boolean(searchMatch(entry,query).limitation)]):[]);
  return [...entries].sort((a,b) =>
    (limited.size ? Number(limited.get(a.id))-Number(limited.get(b.id)) : 0) ||
    (sort==='category' ? categories.indexOf(a.category)-categories.indexOf(b.category) :
      sort==='owner' ? a.owner.localeCompare(b.owner,undefined,{sensitivity:'base'}) : 0) ||
    a.name.localeCompare(b.name,undefined,{sensitivity:'base'}) ||
    a.owner.localeCompare(b.owner,undefined,{sensitivity:'base'}));
}
