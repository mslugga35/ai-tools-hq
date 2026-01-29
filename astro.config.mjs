// Cache buster: 2026-01-29T18:21:00
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ai-tools-hq.com',
  integrations: [sitemap()],
  output: 'static',
  build: {
    // Force fresh build
    inlineStylesheets: 'auto'
  }
});
