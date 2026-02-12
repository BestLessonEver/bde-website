import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://briandoeseverything.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), tailwind(), sitemap()],
});
