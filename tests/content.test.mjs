import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inline, renderMarkdown } from '../src/lib/markdown.mjs';

test('upstream Markdown URLs stay intact while local notes use published HTML routes', async () => {
  const source = 'https://github.com/Macho0x/goose-crypto/blob/abc/README.md#modules';
  assert.ok((await inline(`[Source](${source})`)).includes(`href="${source}"`));
  assert.ok((await inline('[Notes](docs/CHOICES.md#ethereum)')).includes('href="CHOICES.html#ethereum"'));
});

test('raw markup and unsafe link protocols cannot become executable guide HTML', async () => {
  const rendered = await inline('<img src=x onerror=alert(1)> [Note](docs/CHOICES.md#ethereum)');
  assert.ok(!rendered.includes('<img'));
  assert.match(rendered, /&(?:lt|#x3c|#60);img/i);
  assert.ok(rendered.includes('CHOICES.html#ethereum'));
  for (const target of ['javascript:alert', 'data:text/html,example', 'JaVaScRiPt:alert']) {
    assert.ok(!(await inline(`[bad](${target})`)).includes(`href="${target}"`));
  }
});

test('reading tables retain headers, qualification labels and cell wrappers during mobile reflow', async () => {
  const { code } = await renderMarkdown('| Need | Reason and limits |\n| --- | --- |\n| Parse | Bounded input |');
  for (const expected of ['<thead role="rowgroup">', 'data-label="Reason and limits"', '<span class="cell-value">Bounded input</span>', 'scope="col"', 'role="table"']) assert.ok(code.includes(expected), expected);
});

test('table regions use distinct topic names and heading navigation uses the same IDs', async () => {
  const { code, metadata } = await renderMarkdown('## TOML\n\n| Need | Option |\n| --- | --- |\n| Read | Reader |\n\n## SQLite\n\n| Need | Option |\n| --- | --- |\n| System | Binding |');
  assert.ok(code.includes('aria-label="TOML table"'));
  assert.ok(code.includes('aria-label="SQLite table"'));
  assert.deepEqual(metadata.headings.map(heading => heading.slug), ['toml', 'sqlite']);
});

test('numbered instructions preserve ordering and continuation content', async () => {
  const { code } = await renderMarkdown('1. First item.\n   Continued content.\n2. Second item.');
  assert.ok(code.includes('<ol>'));
  assert.ok(!code.includes('<ul>'));
  assert.equal((code.match(/<li>/g) ?? []).length, 2);
  assert.match(code.replace(/\s+/g, ' '), /First item\. Continued content\.<\/li>/);
});
