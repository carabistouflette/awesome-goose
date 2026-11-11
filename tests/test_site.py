import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ('CHOICES','COMPARISONS','CURATION','RESEARCH','DEVELOPMENT','SOURCES')

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.ids=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for key in ('href','src'):
            if key in attrs: self.links.append(attrs[key])

class SiteTests(unittest.TestCase):
    def test_generated_navigation_and_assets(self):
        for path in (ROOT / '_site').glob('*.html'):
            page=Links();page.feed(path.read_text())
            self.assertEqual(len(page.ids),len(set(page.ids)),path.name)
            for link in page.links:
                url=urlsplit(link)
                if url.scheme or url.netloc: continue
                local=unquote(url.path)
                if local.startswith('/awesome-goose/'): local=local.removeprefix('/awesome-goose/')
                target=path.parent / local if local else path
                if target.is_dir(): target=target / 'index.html'
                self.assertTrue(target.is_file(),f'{path.name}: {link}')
                if url.fragment and target.suffix=='.html':
                    other=Links();other.feed(target.read_text())
                    self.assertIn(unquote(url.fragment),other.ids,link)
    def test_catalog_covers_every_admitted_repository_once(self):
        data=json.loads((ROOT / '_site/catalog.json').read_text())
        repos=[e['repository'] for e in data['entries'] if e['repository']]
        expected=re.findall(r'^- \[[^\]]+\]\(https://github.com/([^/\s)]+/[^/\s)]+)\)',(ROOT / 'README.md').read_text(),re.M)
        self.assertCountEqual(repos,expected)
        self.assertEqual(len(repos),len(set(repos)))

    def test_comparison_pins_reference_their_actual_reviewed_baseline(self):
        entries=json.loads((ROOT / '_site/catalog.json').read_text())['entries']
        report=(ROOT / 'docs/COMPARISONS.md').read_text()
        http=next(e for e in entries if e['repository']=='carabistouflette/goose-http')
        self.assertRegex(http['comparisonCommit'],r'^[0-9a-f]{40}$')
        self.assertIn(http['comparisonSource'],report)
        self.assertIn('/'+http['comparisonCommit']+'/README.md',http['comparisonSource'])
    def test_evidence_index_keeps_every_reviewed_snapshot_and_separate_baselines(self):
        page=(ROOT / '_site/SOURCES.html').read_text()
        records=json.loads((ROOT / 'docs/sources.json').read_text())['repositories']
        for record in records:
            self.assertIn(record['repository'],page)
            self.assertIn(record['readme'],page)
            self.assertIn(record['reviewed'],page)
        baselines=dict(re.findall(r'https://github.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)/blob/([a-f0-9]{40})/README\.md',(ROOT / 'docs/COMPARISONS.md').read_text()))
        for repo,commit in baselines.items():
            if any(record['repository']==repo for record in records):
                self.assertIn(f'https://github.com/{repo}/blob/{commit}/README.md',page)
        self.assertIn('Source inventory (JSON)',page)
    def test_search_notes_keep_the_reviewed_source_provenance(self):
        entries=json.loads((ROOT / '_site/catalog.json').read_text())['entries']
        manifest={record['repository']:record for record in json.loads((ROOT / 'docs/sources.json').read_text())['repositories']}
        for entry in entries:
            if entry.get('searchAliases') or entry.get('searchCautions') or entry.get('requirements'):
                evidence=manifest[entry['repository']]
                self.assertEqual(entry['source'],evidence['readme'])
                self.assertEqual(entry['searchAliases'],evidence.get('search_aliases',[]))
                self.assertEqual(entry['searchCautions'],evidence.get('search_cautions',[]))
                self.assertEqual(entry['requirements'],evidence.get('requirements'))


    def test_reading_table_regions_have_distinct_section_names(self):
        for path in (ROOT / '_site').glob('*.html'):
            names=re.findall(r'class="table-wrap"[^>]*aria-label="([^"]+)"',path.read_text())
            self.assertEqual(len(names),len(set(names)),path.name)

    def test_choice_links_are_contextual_and_not_duplicated(self):
        entries=json.loads((ROOT / '_site/catalog.json').read_text())['entries']
        for entry in entries:
            if entry.get('choice'):
                self.assertNotIn('href="'+entry['choice']+'"',entry['descriptionHtml'])
        for repo in ('carabistouflette/goose-url','kaitk/goose-acme','kaitk/goose-tls'):
            self.assertIsNone(next(e['choice'] for e in entries if e['repository']==repo))
        self.assertEqual(next(e['owner'] for e in entries if e['name']=='Documentation'),'aardappel')
        crypto=next(e['description'] for e in entries if e['repository']=='Macho0x/goose-crypto')
        self.assertTrue(crypto.endswith('.'))
        self.assertNotRegex(crypto,r'see the\s*$')
    def test_choice_links_point_to_generated_sections(self):
        data=json.loads((ROOT / '_site/catalog.json').read_text())
        for entry in data['entries']:
            if entry.get('choice'):
                file, anchor=entry['choice'].split('#')
                page=Links();page.feed((ROOT / '_site' / file).read_text())
                self.assertIn(anchor,page.ids,entry['label'])
    def test_guides_have_shared_theme_and_navigation(self):
        for name in GUIDES:
            page=(ROOT / '_site' / (name+'.html')).read_text()
            self.assertIn('goose-theme',page)
            self.assertLess(page.index('goose-theme'),page.index('<body'))
            self.assertIn('data-theme-toggle',page)
            self.assertIn('aria-label="On this page"',page)
            self.assertIn('data-directory-return',page)

    def test_search_engine_discovery_files_are_published(self):
        site=ROOT / '_site'
        tokens=list(site.glob('google*.html'))
        self.assertTrue(tokens,'missing Google Search Console verification file')
        for token in tokens:
            self.assertEqual(token.read_text(),f'google-site-verification: {token.name}')
        self.assertIn('Sitemap: https://carabistouflette.github.io/awesome-goose/sitemap.xml',(site / 'robots.txt').read_text())
        sitemap=(site / 'sitemap.xml').read_text()
        self.assertIn('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',sitemap)
        for page in site.glob('*.html'):
            if page.name.startswith('google'): continue
            url='https://carabistouflette.github.io/awesome-goose/' if page.name=='index.html' else f'https://carabistouflette.github.io/awesome-goose/{page.name}'
            self.assertIn(f'<loc>{url}</loc>',sitemap,page.name)
        self.assertNotIn('catalog.json',sitemap)

    def test_pages_declare_a_canonical_url(self):
        for page in (ROOT / '_site').glob('*.html'):
            if page.name.startswith('google'): continue
            url='https://carabistouflette.github.io/awesome-goose/' if page.name=='index.html' else f'https://carabistouflette.github.io/awesome-goose/{page.name}'
            self.assertIn(f'<link rel="canonical" href="{url}">',page.read_text(),page.name)

if __name__=='__main__': unittest.main()
