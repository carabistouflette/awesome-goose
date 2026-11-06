import { inventory } from '../lib/content.mjs';

export function GET() {
  return new Response(JSON.stringify(inventory, null, 2)+'\n', {
    headers: { 'Content-Type': 'application/json' },
  });
}
