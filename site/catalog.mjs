export function filterEntries(entries, filters, favorites) {
  const words = filters.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return entries.filter(e => (!filters.category || e.category === filters.category) && (!filters.owner || e.owner === filters.owner) && (!filters.saved || favorites.has(e.id)) && words.every(w => `${e.label} ${e.owner} ${e.category} ${e.description}`.toLocaleLowerCase().includes(w)));
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

export function sortEntries(entries, sort, categories) {
  return [...entries].sort((a,b) =>
    (sort==='category' ? categories.indexOf(a.category)-categories.indexOf(b.category) :
      sort==='owner' ? a.owner.localeCompare(b.owner,undefined,{sensitivity:'base'}) : 0) ||
    a.name.localeCompare(b.name,undefined,{sensitivity:'base'}) ||
    a.owner.localeCompare(b.owner,undefined,{sensitivity:'base'}));
}
