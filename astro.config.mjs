// Cache buster: 2026-01-31T08:12:00
import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap'; // TODO: Fix sitemap plugin

export default defineConfig({
  site: 'https://www.ai-tools-hq.com',
  integrations: [
    // Sitemap disabled temporarily - existing sitemap.xml works
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});
