import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inline, linkTarget, renderMarkdown, slug } from './markdown.mjs';

export const repository = 'https://github.com/carabistouflette/awesome-goose';
export const guideNames = ['CHOICES', 'COMPARISONS', 'CURATION', 'RESEARCH', 'DEVELOPMENT', 'SOURCES'];
// Astro prerenders from a bundled server module, so resolve repository inputs
// from the npm project root rather than the generated chunk's location.
const read = path => readFileSync(resolve(process.cwd(), path), 'utf8');
export const inventory = JSON.parse(read('docs/sources.json'));

export function comparisonBaselines() {
  const pins = new Map();
  for (const [, repo, commit] of read('docs/COMPARISONS.md').matchAll(/https:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\/blob\/([a-f0-9]{40})\/README\.md/g)) {
    if (!pins.has(repo)) pins.set(repo, commit);
  }
  return pins;
}

function choiceLink(repo, category) {
  if (!repo) return null;
  const ends = (...names) => names.some(name => repo.endsWith(name));
  const topics = {
    'Command line and configuration': ends('goose-log', 'goose-logger') ? 'logging' : null,
    'Data formats and text': repo.includes('toml') ? 'toml' : ends('goose-deflate', 'goose-compress') ? 'compression-and-archives' : null,
    'Files, processes, and artifacts': ends('goose-archive') ? 'compression-and-archives' : null,
    'Networking and web': ends('goose-http', 'plod') ? 'http-and-web' : null,
    'Databases': ends('goose-sqlite') ? 'sqlite' : null,
    'Cryptography': 'cryptography',
    'Ethereum and signing': 'ethereum',
    'Development tools': ends('goose.go') ? 'go-integration' : repo.startsWith('exaroth/') || ends('goose-zed') ? 'shell-and-editor-additions' : null,
    'Applications': 'shell-and-editor-additions',
  };
  return topics[category] ? `CHOICES.html#${topics[category]}` : null;
}

export async function buildCatalog() {
  const sources = new Map(inventory.repositories.map(source => [source.repository, source]));
  const baselines = comparisonBaselines();
  const entries = [];
  let section = '', category = '';
  for (const line of read('README.md').split(/\r?\n/)) {
    if (line.startsWith('## ')) section = category = line.slice(3);
    else if (line.startsWith('### ')) category = line.slice(4);
    const match = line.match(/^- \[([^\]]+)\]\((https:\/\/[^\s)]+)\) — (.+)$/);
    if (!match || ['Contributing', 'License'].includes(section)) continue;
    const [, label, url] = match;
    let description = match[3];
    const path = url.replace('https://github.com/', '').split('/');
    const repo = url.startsWith('https://github.com/') ? path.slice(0, 2).join('/') : null;
    const source = sources.get(repo);
    const exactRepo = !!repo && path.length === 2;
    const choice = choiceLink(repo, category);
    const names = { 'http-and-web': 'HTTP', cryptography: 'cryptography', ethereum: 'Ethereum', toml: 'TOML', logging: 'logging', sqlite: 'SQLite', 'compression-and-archives': 'compression', 'go-integration': 'Go integration', 'shell-and-editor-additions': 'shell and editor' };
    if (choice) {
      description = description.replace(/\[([^\]]+)\]\((docs\/CHOICES\.md#[^\s)]+)\)\.?/g, (original, label, target) => linkTarget(target) === choice ? '' : original).trim().replace(/;\s*see\s+(?:the\s*)?$/, '.');
    }
    const comparisonCommit = baselines.get(repo) ?? null;
    entries.push({
      id: slug(label), name: exactRepo ? label.split('/').at(-1) : label,
      label, url, category, section,
      owner: repo ? path[0] : url.startsWith('https://aardappel.github.io/goose') ? 'aardappel' : url.includes('reddit.com/') ? 'Reddit community' : 'Community',
      description, descriptionHtml: await inline(description), license: source?.license ?? null,
      reviewed: source?.reviewed ?? inventory.review_date,
      source: exactRepo ? source?.readme ?? null : source && url.includes('/blob/') ? url.replace('/blob/master/', `/blob/${source.commit}/`).replace('/blob/main/', `/blob/${source.commit}/`) : null,
      commit: source?.commit ?? null, choice, choiceLabel: choice ? `Compare ${names[choice.split('#')[1]]} options` : 'Choice notes',
      searchAliases: exactRepo ? source?.search_aliases ?? [] : [],
      searchCautions: exactRepo ? source?.search_cautions ?? [] : [],
      requirements: exactRepo ? source?.requirements ?? null : null,
      comparisonCommit, comparisonSource: comparisonCommit ? `https://github.com/${repo}/blob/${comparisonCommit}/README.md` : null,
      repository: exactRepo ? repo : null,
    });
  }
  if (!entries.length || new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error('Empty catalog or duplicate entry IDs');
  return { reviewed: inventory.review_date, entries };
}

function sourceIndex() {
  const baselines = comparisonBaselines();
  const sections = [];
  const sort = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase(), 'en');
  for (const owner of [...new Set(inventory.repositories.map(record => record.repository.split('/')[0]))].sort(sort)) {
    sections.push(`## ${owner}\n\n| Repository | License recorded | Directory snapshot and review date | Separate comparison baseline |\n| --- | --- | --- | --- |`);
    for (const record of inventory.repositories.filter(record => record.repository.split('/')[0] === owner).sort((a, b) => sort(a.repository, b.repository))) {
      const repo = record.repository, baseline = baselines.get(repo);
      const comparison = baseline && baseline !== record.commit ? `[${baseline.slice(0,7)}](https://github.com/${repo}/blob/${baseline}/README.md)` : baseline ? 'Same snapshot' : 'No separate baseline indexed';
      sections.push(`| [${repo}](https://github.com/${repo}) | ${record.license || 'Not recorded'} | [${record.commit.slice(0,7)}](${record.readme}) · ${record.reviewed} | ${comparison} |`);
    }
    sections.push('');
  }
  return sections.join('\n');
}

// Search-result summaries. The guides open with review dates and link runs, so
// their first paragraph is a poor description; these state the page's purpose.
const guideDescriptions = {
  CHOICES: 'Which Goose library to pick for logging, HTTP, TOML, SQLite, cryptography and compression, with the tradeoffs behind each choice.',
  COMPARISONS: 'Public Goose library comparisons: carabistouflette and Macho0x packages side by side, pinned to reviewed commits.',
  CURATION: 'How the Awesome Goose directory is curated: admission criteria, categories, and what a listing does and does not claim.',
  RESEARCH: 'The research trail behind the directory: method, reviewed snapshots, and the limits of the evidence.',
  DEVELOPMENT: 'Documented gaps in the Goose library ecosystem and the additions that would close them.',
  SOURCES: 'Reviewed source pins for every listed Goose library, with the exact README commit inspected.',
};

export async function buildGuide(name) {
  if (!guideNames.includes(name)) throw new Error('Unknown guide');
  let document = read(`docs/${name}.md`);
  if (name === 'SOURCES') document = document.replace(/<!-- GITHUB_ONLY -->[\s\S]*?<!-- \/GITHUB_ONLY -->\s*/g, '').replace('<!-- SOURCE_INDEX -->', sourceIndex());
  const { code, metadata } = await renderMarkdown(document);
  const sections = metadata.headings.filter(heading => heading.depth === 2 || heading.depth === 3);
  const title = { CHOICES: 'Choice notes', SOURCES: 'Source evidence' }[name] ?? name[0]+name.slice(1).toLowerCase();
  return { name, title, description: guideDescriptions[name], content: code, sections };
}
