import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.ai-tools-hq.com',
  output: 'static',
  build: {
    assets: '_astro'
  }
});
