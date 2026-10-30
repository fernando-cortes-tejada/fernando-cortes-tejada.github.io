// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` drives canonical, hreflang and og:image URLs in Base.astro;
// switch it when a custom domain is added.
export default defineConfig({
  site: 'https://fernando-cortes-tejada.github.io',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-PE' } },
    }),
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
