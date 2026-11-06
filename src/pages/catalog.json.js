import { buildCatalog } from '../lib/content.mjs';

export async function GET() {
  return new Response(JSON.stringify(await buildCatalog(), null, 2)+'\n', {
    headers: { 'Content-Type': 'application/json' },
  });
}
