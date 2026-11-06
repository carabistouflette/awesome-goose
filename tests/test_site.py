import importlib.util
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('build_site', ROOT / 'scripts/build-site.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

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
                target=path.parent / unquote(url.path) if url.path else path
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
    def test_numbered_list_and_continuation_semantics(self):
        rendered=build.markdown('1. First item.\n   Continued content.\n2. Second item.')
        self.assertIn('<ol>',rendered)
        self.assertNotIn('<ul>',rendered)
        self.assertIn('First item. Continued content.</p></li>',rendered)
        self.assertEqual(rendered.count('<li>'),2)
    def test_choice_links_point_to_generated_sections(self):
        data=json.loads((ROOT / '_site/catalog.json').read_text())
        for entry in data['entries']:
            if entry.get('choice'):
                file, anchor=entry['choice'].split('#')
                page=Links();page.feed((ROOT / '_site' / file).read_text())
                self.assertIn(anchor,page.ids,entry['label'])
    def test_guides_have_shared_theme_and_navigation(self):
        for name in ('CHOICES','COMPARISONS','CURATION','RESEARCH'):
            page=(ROOT / '_site' / (name+'.html')).read_text()
            self.assertIn('src="theme.js"',page)
            self.assertIn('data-theme-toggle',page)
            self.assertIn('aria-label="On this page"',page)
            self.assertIn('data-directory-return',page)
    def test_unsafe_text_is_escaped_and_local_notes_link_to_html(self):
        rendered=build.inline('<img src=x onerror=alert(1)> [Note](docs/CHOICES.md#ethereum)')
        self.assertNotIn('<img',rendered)
        self.assertIn('CHOICES.html#ethereum',rendered)
        self.assertNotIn('href="javascript:',build.inline('[bad](javascript:alert)'))

if __name__=='__main__': unittest.main()
