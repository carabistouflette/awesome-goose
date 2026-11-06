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

    aliases=record.get('search_aliases',[])
    cautions=record.get('search_cautions',[])
    if not isinstance(aliases,list) or not all(isinstance(term,str) and term.strip() for term in aliases):
        errors.append(f'Invalid search aliases: {repo}')
    if not isinstance(cautions,list) or not all(isinstance(caution,dict) and isinstance(caution.get('note'),str) and caution['note'].strip() and isinstance(caution.get('terms'),list) and caution['terms'] and all(isinstance(term,str) and term.strip() for term in caution['terms']) for caution in cautions):
        errors.append(f'Invalid search cautions: {repo}')

    requirements=record.get('requirements')
    if requirements is not None:
        valid=isinstance(requirements,dict)
        if valid:
            native=requirements.get('native',[])
            implementation=requirements.get('implementation')
            platform=requirements.get('platform',[])
            valid=isinstance(native,list) and all(isinstance(name,str) and name.strip() for name in native)
            valid=valid and (implementation is None or isinstance(implementation,dict) and implementation.get('kind') in ('goose','go') and isinstance(implementation.get('note'),str) and implementation['note'].strip())
            valid=valid and isinstance(platform,list) and all(isinstance(note,dict) and isinstance(note.get('note'),str) and note['note'].strip() and isinstance(note.get('tags'),list) and note['tags'] and all(tag in ('linux','unix','desktop64','sdk','other') for tag in note['tags']) for note in platform)
        if not valid: errors.append(f'Invalid requirement notes: {repo}')


def anchors(path):
    counts, found = {}, set()
    for heading in re.findall(r'^#{1,6}\s+(.+)$', path.read_text(), re.M):
        slug = re.sub(r'[^\w\- ]', '', heading.lower()).replace(' ', '-')
        count = counts.get(slug, 0)
        found.add(f'{slug}-{count}' if count else slug)
        counts[slug] = count + 1
    return found


for path in ROOT.rglob('*.md'):
    if any(part in ('node_modules','.git','_site') for part in path.relative_to(ROOT).parts):
        continue
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
