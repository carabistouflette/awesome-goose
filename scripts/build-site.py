#!/usr/bin/env python3
"""Build GitHub Pages from the curated README and evidence; no network or dependencies."""
import html
import hashlib
import json
import re
import shutil
from urllib.parse import urlsplit
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
REPO = 'https://github.com/carabistouflette/awesome-goose'
GUIDES = ('CHOICES','COMPARISONS','CURATION','RESEARCH','DEVELOPMENT','SOURCES')


def slug(text):
    return re.sub(r'[^\w\- ]', '', text.lower()).replace(' ', '-')


def link_target(target):
    if urlsplit(target).scheme or target.startswith('//'):
        return target
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
    lines, output, i = text.splitlines(), [], 0
    table_context,table_number='Comparison',0
    bullet = re.compile(r'^(?:([-+*]) |(\d+)\. )(.+)')
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith('```'):
            block = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                block.append(lines[i])
                i += 1
            output.append('<pre><code>' + html.escape('\n'.join(block)) + '</code></pre>')
            i += 1
            continue
        heading = re.match(r'^(#{1,6}) (.+)', line)
        if heading:
            level, title = len(heading[1]), heading[2]
            table_context,table_number=re.sub(r'[`*]', '', title),0
            output.append(f'<h{level} id="{slug(title)}">{inline(title)}</h{level}>')
            i += 1
            continue
        if line.startswith('|'):
            rows, headers = [], []
            while i < len(lines) and lines[i].startswith('|'):
                cells = re.split(r'(?<!\\)\|', lines[i].strip().strip('|'))
                if not all(re.fullmatch(r'\s*:?-+:?\s*', c) for c in cells):
                    if not rows:
                        headers=[re.sub(r'[`*]', '', c.strip()) for c in cells]
                        row=''.join(f'<th scope="col" role="columnheader">{inline(c.strip())}</th>' for c in cells)
                    else:
                        row=''.join(f'<td role="cell" data-label="{html.escape(headers[n] if n<len(headers) else "Value", quote=True)}"><span class="cell-value">{inline(c.strip())}</span></td>' for n,c in enumerate(cells))
                    rows.append('<tr role="row">'+row+'</tr>')
                i += 1
            table_number+=1
            table_label=html.escape(table_context+' table'+(' '+str(table_number) if table_number>1 else ''),quote=True)
            output.append('<div class="table-wrap" tabindex="0" role="region" aria-label="'+table_label+'"><table role="table"><thead role="rowgroup">' + rows[0] + '</thead><tbody role="rowgroup">' + ''.join(rows[1:]) + '</tbody></table></div>')
            continue
        match = bullet.match(line)
        if match:
            tag = 'ol' if match[2] else 'ul'
            start = f' start="{int(match[2])}"' if match[2] and int(match[2]) != 1 else ''
            items = []
            while i < len(lines):
                match = bullet.match(lines[i])
                if not match or ('ol' if match[2] else 'ul') != tag:
                    break
                item = [match[3]]
                i += 1
                while i < len(lines):
                    if lines[i].startswith('  '):
                        item.append(lines[i][2:])
                        i += 1
                    elif not lines[i].strip():
                        following = i + 1
                        while following < len(lines) and not lines[following].strip():
                            following += 1
                        if following < len(lines) and lines[following].startswith('  '):
                            item.append('')
                            i = following
                        else:
                            i = following
                            break
                    else:
                        break
                items.append('<li>' + markdown('\n'.join(item)) + '</li>')
            output.append(f'<{tag}{start}>' + ''.join(items) + f'</{tag}>')
            continue
        paragraph = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#{1,6} |```|\|)', lines[i]) and not bullet.match(lines[i]):
            paragraph.append(lines[i].strip())
            i += 1
        output.append('<p>' + inline(' '.join(paragraph)) + '</p>')
    return '\n'.join(output)


def choice_link(repo, category):
    if not repo:
        return None
    topic = {
        'Command line and configuration': 'logging' if repo.endswith(('goose-log', 'goose-logger')) else None,
        'Data formats and text': 'toml' if 'toml' in repo else 'compression-and-archives' if repo.endswith(('goose-deflate', 'goose-compress')) else None,
        'Files, processes, and artifacts': 'compression-and-archives' if repo.endswith('goose-archive') else None,
        'Networking and web': 'http-and-web' if repo.endswith(('goose-http','plod')) else None,
        'Databases': 'sqlite' if repo.endswith('goose-sqlite') else None,
        'Cryptography': 'cryptography',
        'Ethereum and signing': 'ethereum',
        'Development tools': 'go-integration' if repo.endswith('goose.go') else 'shell-and-editor-additions' if repo.startswith('exaroth/') or repo.endswith('goose-zed') else None,
        'Applications': 'shell-and-editor-additions',
    }.get(category)
    return f'CHOICES.html#{topic}' if topic else None


def comparison_baselines():
    baselines={}
    comparison=(ROOT / 'docs/COMPARISONS.md').read_text()
    for repo,commit in re.findall(r'https://github.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)/blob/([a-f0-9]{40})/README\.md',comparison):
        baselines.setdefault(repo,commit)
    return baselines


def source_index():
    records=json.loads((ROOT / 'docs/sources.json').read_text())['repositories']
    baselines=comparison_baselines()
    sections=[]
    for owner in sorted({record['repository'].split('/')[0] for record in records},key=str.casefold):
        sections.append('## '+owner+'\n\n| Repository | License recorded | Directory snapshot and review date | Separate comparison baseline |\n| --- | --- | --- | --- |')
        for record in sorted((record for record in records if record['repository'].split('/')[0]==owner),key=lambda record:record['repository'].casefold()):
            repo,commit=record['repository'],record['commit']
            baseline=baselines.get(repo)
            comparison=f'[{baseline[:7]}](https://github.com/{repo}/blob/{baseline}/README.md)' if baseline and baseline!=commit else 'Same snapshot' if baseline else 'No separate baseline indexed'
            sections.append(f"| [{repo}](https://github.com/{repo}) | {record.get('license') or 'Not recorded'} | [{commit[:7]}]({record['readme']}) · {record['reviewed']} | {comparison} |")
        sections.append('')
    return '\n'.join(sections)


def catalog():
    manifest = json.loads((ROOT / 'docs/sources.json').read_text())
    sources = {s['repository']: s for s in manifest['repositories']}
    baselines=comparison_baselines()
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
        choice = choice_link(repo, category)
        choice_label = 'Choice notes'
        if choice:
            topic=choice.split('#')[1]
            names={'http-and-web':'HTTP','cryptography':'cryptography','ethereum':'Ethereum','toml':'TOML','logging':'logging','sqlite':'SQLite','compression-and-archives':'compression','go-integration':'Go integration','shell-and-editor-additions':'shell and editor'}
            choice_label='Compare '+names[topic]+' options'
        if choice:
            for note in list(re.finditer(r'\[([^\]]+)\]\((docs/CHOICES\.md#[^\s)]+)\)', description)):
                if link_target(note[2]) == choice:
                    description = re.sub(re.escape(note[0]) + r'\.?', '', description).strip()
                    description = re.sub(r';\s*see\s+(?:the\s*)?$', '.', description)
        entries.append({
            'id': slug(label), 'name': label.split('/')[-1] if exact_repo else label,
            'label': label, 'url': url, 'category': category, 'section': section,
            'owner': path[0] if repo else 'aardappel' if url.startswith('https://aardappel.github.io/goose') else 'Reddit community' if 'reddit.com/' in url else 'Community', 'description': description,
            'descriptionHtml': inline(description), 'license': source.get('license'),
            'reviewed': source.get('reviewed', manifest['review_date']),
            'source': source.get('readme') if exact_repo else (url.replace('/blob/master/', '/blob/' + source['commit'] + '/').replace('/blob/main/', '/blob/' + source['commit'] + '/') if source and '/blob/' in url else None), 'commit': source.get('commit'),
            'choice': choice, 'choiceLabel': choice_label,
            'searchAliases': source.get('search_aliases',[]) if exact_repo else [],
            'searchCautions': source.get('search_cautions',[]) if exact_repo else [],
            'requirements': source.get('requirements') if exact_repo else None,
            'comparisonCommit': baselines.get(repo),
            'comparisonSource': f'https://github.com/{repo}/blob/{baselines[repo]}/README.md' if repo in baselines else None,
            'repository': repo if exact_repo else None,
        })
    if not entries or len({e['id'] for e in entries}) != len(entries):
        raise ValueError('Empty catalog or duplicate entry IDs')
    return {'reviewed': manifest['review_date'], 'entries': entries}


def main():
    data = catalog()
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir()
    assets = {}
    def asset(name, content):
        path=Path(name)
        filename=f'{path.stem}.{hashlib.sha256(content).hexdigest()[:12]}{path.suffix}'
        (OUT / filename).write_bytes(content)
        return filename
    for name in ('style.css','catalog.mjs','theme.js'):
        assets[name]=asset(name,(ROOT / 'site' / name).read_bytes())
    app=(ROOT / 'site/app.js').read_text().replace("'./catalog.mjs'", "'./"+assets['catalog.mjs']+"'")
    assets['app.js']=asset('app.js',app.encode())
    def asset_links(page):
        for original,filename in assets.items():
            for attribute in ('src','href'):
                page=page.replace(f'{attribute}="{original}"',f'{attribute}="{filename}"')
        return page
    payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')
    template = (ROOT / 'site/index.html').read_text()
    (OUT / 'index.html').write_text(asset_links(template.replace('<!-- CATALOG_DATA -->', f'<script id="catalog-data" type="application/json">{payload}</script>')))
    (OUT / 'catalog.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    for name in GUIDES:
        document=(ROOT / 'docs' / f'{name}.md').read_text()
        if name=='SOURCES':
            document=re.sub(r'<!-- GITHUB_ONLY -->.*?<!-- /GITHUB_ONLY -->\s*','',document,flags=re.S)
            document=document.replace('<!-- SOURCE_INDEX -->',source_index())
        content = markdown(document)
        if name=='SOURCES':
            controls='<div class="source-index-tools"><label for="source-search">Find repository <kbd>/</kbd><input id="source-search" data-source-search type="search" aria-keyshortcuts="/" placeholder="Owner or repository…" autocomplete="off" aria-describedby="source-search-status"></label><button id="source-search-clear" class="text-button" type="button">Clear</button></div><p id="source-search-status" class="source-index-status" role="status"></p>'
            content=content.replace('<h2',controls+'<h2',1)
        sections = re.findall(r'^(#{2,3}) (.+)$', document, re.M)
        contents = ''.join(f'<a class="{"toc-subsection" if len(level)==3 else "toc-section"}" href="#{slug(title)}">{html.escape(title)}</a>' for level,title in sections)
        toc = f'<nav id="guide-contents" tabindex="-1" class="guide-toc" aria-label="On this page"><a href="./" class="toc-return" data-directory-return>← Directory</a><details open data-guide-contents><summary>On this page</summary>{contents}</details></nav>'
        search_skip='<a class="skip" href="#source-search">Skip to repository search</a>' if name=='SOURCES' else ''
        title = {'CHOICES':'Choice notes','SOURCES':'Source evidence'}.get(name,name.title())
        page = f'''<!doctype html><html lang="en" class="guide-root"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · Awesome Goose</title><script src="theme.js"></script><link rel="stylesheet" href="style.css"></head><body class="guide-page guide-{name.lower()}"><a class="skip" href="#guide">Skip to content</a>{search_skip}<header class="guide-header"><a class="brand" href="./" data-directory-return>🪿 Awesome Goose</a><nav aria-label="Guide navigation"><a href="./" data-directory-return>← Back to directory</a><button class="icon-button" data-theme-toggle aria-label="Change theme">◐</button></nav></header><nav class="guide-mobile-nav" aria-label="Reading navigation"><a href="./" data-directory-return>← Directory</a><a href="#guide-contents" data-contents-open>Contents ↑</a></nav><div class="guide-layout">{toc}<main id="guide" tabindex="-1" class="prose">{content}</main></div><footer class="guide-footer"><a href="{REPO}/blob/main/docs/{name}.md">Edit this guide on GitHub ↗</a></footer></body></html>'''
        (OUT / f'{name}.html').write_text(asset_links(page))
    shutil.copyfile(ROOT / 'docs/sources.json', OUT / 'sources.json')
    (OUT / '.nojekyll').touch()
    print(f'Built {len(data["entries"])} resources and {len(GUIDES)} guides in {OUT}')


if __name__ == '__main__': main()
