import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ai-tools-hq.com',
  integrations: [sitemap()],
  output: 'static',
  build: {
    assets: '_astro'
  }
});
