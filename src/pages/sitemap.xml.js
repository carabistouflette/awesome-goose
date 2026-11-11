import { guideNames } from '../lib/content.mjs';

// The directory and its guides are the only indexable pages; JSON endpoints and
// the Google verification token stay out of the sitemap.
export async function GET({ site }) {
  // BASE_URL is not guaranteed to end with a slash; without it, relative paths
  // resolve against the domain root instead of the Pages base.
  const root = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const paths = ['', ...guideNames.map(name => `${name}.html`)];
  const urls = paths.map(path => `  <url><loc>${new URL(path, root)}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
