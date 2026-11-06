import { createMarkdownProcessor } from '@astrojs/markdown-remark';

export const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, '').replaceAll(' ', '-');

export function linkTarget(target) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return target;
  return target.replace(/^docs\//, '').replace(/\.md(?=$|[?#])/, '.html');
}

// Curated Markdown is prose, not an HTML execution surface. Keep raw markup visible
// as text and rewrite local guide links without changing upstream README URLs.
function proseLinks() {
  return tree => {
    function walk(node) {
      if (node.type === 'html') node.type = 'text';
      if (node.type === 'link' || node.type === 'definition') {
        if (/^[a-z][a-z\d+.-]*:/i.test(node.url) && !/^https?:\/\//i.test(node.url)) node.url = '#';
        else node.url = linkTarget(node.url);
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}

const textOf = node => node.value ?? node.children?.map(textOf).join('') ?? '';
const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });

// Retain the existing reading-table reflow and explicit table semantics. The
// processor supplies CommonMark/GFM parsing; this plugin only adds presentation.
function readingTables() {
  return tree => {
    let context = 'Comparison', number = 0;
    function walk(parent) {
      parent.children = parent.children?.map(node => {
        if (node.type !== 'element') return node;
        if (/^h[1-6]$/.test(node.tagName)) {
          context = textOf(node); number = 0;
          node.properties.id = slug(context);
        }
        if (node.tagName !== 'table') { walk(node); return node; }
        number++;
        const headers = [];
        node.properties.role = 'table';
        for (const group of node.children.filter(child => child.type === 'element')) {
          group.properties.role = 'rowgroup';
          for (const row of group.children.filter(child => child.type === 'element')) {
            row.properties.role = 'row';
            row.children.filter(child => child.type === 'element').forEach((cell, index) => {
              if (cell.tagName === 'th') {
                headers[index] = textOf(cell);
                Object.assign(cell.properties, { scope: 'col', role: 'columnheader' });
              } else {
                Object.assign(cell.properties, { role: 'cell', 'data-label': headers[index] ?? 'Value' });
                cell.children = [element('span', { className: ['cell-value'] }, cell.children)];
              }
            });
          }
        }
        return element('div', { className: ['table-wrap'], tabIndex: 0, role: 'region', 'aria-label': `${context} table${number > 1 ? ' '+number : ''}` }, [node]);
      });
    }
    walk(tree);
  };
}

const processor = await createMarkdownProcessor({
  gfm: true,
  smartypants: false,
  syntaxHighlight: false,
  remarkPlugins: [proseLinks],
  rehypePlugins: [readingTables],
});

export const renderMarkdown = text => processor.render(text);
export async function inline(text) {
  return (await renderMarkdown(text)).code.replace(/^<p>/, '').replace(/<\/p>$/, '');
}
