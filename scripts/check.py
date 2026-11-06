#!/usr/bin/env python3
"""Check this catalog's local navigation and reviewed-source inventory offline."""
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors = []
manifest = json.loads((ROOT / 'docs/sources.json').read_text())
records = manifest['repositories']
known = {r['repository'] for r in records}
if len(known) != len(records):
    errors.append('Duplicate source-inventory repository')
for record in records:
    repo, sha = record['repository'], record['commit']
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repo):
        errors.append(f'Invalid repository: {repo}')
    if not re.fullmatch(r'[0-9a-f]{40}', sha):
        errors.append(f'Invalid full commit: {repo}')
    if record['readme'] != f'https://github.com/{repo}/blob/{sha}/README.md':
        errors.append(f'Invalid snapshot URL: {repo}')
    if record['reviewed'] != manifest['review_date']:
        errors.append(f'Inconsistent review date: {repo}')


def anchors(path):
    counts, found = {}, set()
    for heading in re.findall(r'^#{1,6}\s+(.+)$', path.read_text(), re.M):
        slug = re.sub(r'[^\w\- ]', '', heading.lower()).replace(' ', '-')
        count = counts.get(slug, 0)
        found.add(f'{slug}-{count}' if count else slug)
        counts[slug] = count + 1
    return found


for path in ROOT.rglob('*.md'):
    for target in re.findall(r'\[[^\]]*\]\(([^\s)]+)\)', path.read_text()):
        url = urlsplit(target)
        if url.scheme or url.netloc:
            continue
        dest = (path.parent / unquote(url.path)).resolve() if url.path else path
        if not dest.is_relative_to(ROOT) or not dest.is_file():
            errors.append(f'{path.relative_to(ROOT)}: missing local target {target}')
        elif url.fragment and dest.suffix == '.md' and unquote(url.fragment) not in anchors(dest):
            errors.append(f'{path.relative_to(ROOT)}: missing anchor {target}')

readme = (ROOT / 'README.md').read_text()
entries = re.findall(r'^- \[([^\]]+)\]\(https://github.com/([^/\s)]+/[^/\s)]+)\)', readme, re.M)
listed = []
for label, repo in entries:
    if repo not in known:
        errors.append(f'No source snapshot for {repo}')
    listed.append(repo)
if len(listed) != len(set(listed)):
    errors.append('Duplicate repository entry in README')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: local links and anchors; {len(listed)} repository entries; {len(records)} source snapshots')
