import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://carabistouflette.github.io',
  base: '/awesome-goose',
  output: 'static',
  outDir: './_site',
  build: { format: 'file' },
});
