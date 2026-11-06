#!/usr/bin/env python3
"""Build GitHub Pages from the curated README and evidence; no network or dependencies."""
import html
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
REPO = 'https://github.com/carabistouflette/awesome-goose'


def slug(text):
    return re.sub(r'[^\w\- ]', '', text.lower()).replace(' ', '-')


def link_target(target):
    if target.startswith('docs/'):
        target = target[5:]
    if '.md' in target:
        target = target.replace('.md', '.html')
    return target


def inline(text):
    # Escape first; only allow explicit HTTP(S), fragments, and local document links.
    text = html.escape(text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    def link(m):
        label, target = m.groups()
        if ':' in target and not target.startswith(('https://', 'http://')):
            return label
        return f'<a href="{link_target(target)}">{label}</a>'
    return re.sub(r'\[([^\]]+)\]\(([^\s)]+)\)', link, text)


def markdown(text):
    lines, output, paragraph = text.splitlines(), [], []
    in_list, in_code = False, False
    def flush():
        if paragraph:
            output.append('<p>' + inline(' '.join(paragraph)) + '</p>')
            paragraph.clear()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith('```'):
            flush()
            if in_list:
                output.append('</ul>'); in_list = False
            output.append('</code></pre>' if in_code else '<pre><code>')
            in_code = not in_code; i += 1; continue
        if in_code:
            output.append(html.escape(line) + '\n'); i += 1; continue
        if line.startswith('|'):
            flush()
            if in_list:
                output.append('</ul>'); in_list = False
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = lines[i].strip().strip('|').split('|')
                if not all(re.fullmatch(r'\s*:?-+:?\s*', c) for c in cells):
                    tag = 'th' if not rows else 'td'
                    rows.append('<tr>' + ''.join(f'<{tag}>{inline(c.strip())}</{tag}>' for c in cells) + '</tr>')
                i += 1
            output.append('<div class="table-wrap"><table>' + ''.join(rows) + '</table></div>'); continue
        heading = re.match(r'^(#{1,6}) (.+)', line)
        bullet = re.match(r'^(?:- |\d+\. )(.+)', line)
        if heading or bullet or not line.strip():
            flush()
        if in_list and not bullet and not (line.startswith('  ') and line.strip()):
            output.append('</ul>'); in_list = False
        if heading:
            n, title = len(heading[1]), heading[2]
            output.append(f'<h{n} id="{slug(title)}">{inline(title)}</h{n}>')
        elif bullet:
            if not in_list:
                output.append('<ul>'); in_list = True
            # Close at the next bullet/end, permitting continuation lines below.
            output.append('<li>' + inline(bullet[1]) + '</li>')
        elif line.strip():
            paragraph.append(line.strip())
        i += 1
    flush()
    if in_list: output.append('</ul>')
    return '\n'.join(output)


def catalog():
    manifest = json.loads((ROOT / 'docs/sources.json').read_text())
    sources = {s['repository']: s for s in manifest['repositories']}
    entries, section, category = [], '', ''
    for line in (ROOT / 'README.md').read_text().splitlines():
        if line.startswith('## '):
            section = line[3:]; category = section
        elif line.startswith('### '):
            category = line[4:]
        match = re.match(r'^- \[([^\]]+)\]\((https://[^\s)]+)\) — (.+)$', line)
        if not match: continue
        label, url, description = match.groups()
        if section in ('Contributing', 'License'): continue
        path = url.removeprefix('https://github.com/').split('/')
        repo = '/'.join(path[:2]) if url.startswith('https://github.com/') else None
        source = sources.get(repo, {})
        exact_repo = bool(repo and len(path) == 2)
        entries.append({
            'id': slug(label), 'name': label.split('/')[-1] if exact_repo else label,
            'label': label, 'url': url, 'category': category, 'section': section,
            'owner': path[0] if repo else 'Community', 'description': description,
            'descriptionHtml': inline(description), 'license': source.get('license'),
            'reviewed': source.get('reviewed', manifest['review_date']),
            'source': source.get('readme'), 'commit': source.get('commit'),
            'repository': repo if exact_repo else None,
        })
    if not entries or len({e['id'] for e in entries}) != len(entries):
        raise ValueError('Empty catalog or duplicate entry IDs')
    return {'reviewed': manifest['review_date'], 'entries': entries}


def main():
    data = catalog()
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir()
    for name in ('style.css', 'app.js', 'catalog.mjs'):
        shutil.copyfile(ROOT / 'site' / name, OUT / name)
    payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')
    template = (ROOT / 'site/index.html').read_text()
    (OUT / 'index.html').write_text(template.replace('<!-- CATALOG_DATA -->', f'<script id="catalog-data" type="application/json">{payload}</script>'))
    (OUT / 'catalog.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    for name in ('CHOICES', 'COMPARISONS', 'CURATION', 'RESEARCH'):
        content = markdown((ROOT / 'docs' / f'{name}.md').read_text())
        page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{name.title()} · Awesome Goose</title><link rel="stylesheet" href="style.css"></head><body class="guide-page"><a class="skip" href="#guide">Skip to content</a><header class="guide-header"><a class="brand" href="./">🪿 Awesome Goose</a><a href="./">← Back to the directory</a></header><main id="guide" class="prose">{content}</main><footer class="guide-footer"><a href="{REPO}/blob/main/docs/{name}.md">Edit this guide on GitHub ↗</a></footer></body></html>'''
        (OUT / f'{name}.html').write_text(page)
    shutil.copyfile(ROOT / 'docs/sources.json', OUT / 'sources.json')
    (OUT / '.nojekyll').touch()
    print(f'Built {len(data["entries"])} resources and 4 guides in {OUT}')


if __name__ == '__main__': main()
