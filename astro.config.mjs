import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://open.awareride.com',
  output: 'static',

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
