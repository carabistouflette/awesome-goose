export function filterEntries(entries, filters, favorites) {
  const words = filters.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return entries.filter(e => (!filters.category || e.category === filters.category) && (!filters.owner || e.owner === filters.owner) && (!filters.saved || favorites.has(e.id)) && words.every(w => `${e.label} ${e.owner} ${e.category} ${e.description}`.toLocaleLowerCase().includes(w)));
}
