// @ts-check
import { defineConfig } from 'astro/config';

// `site` drives canonical, hreflang and og:image URLs in Base.astro;
// switch it when a custom domain is added.
export default defineConfig({
  site: 'https://fernando-cortes-tejada.github.io',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
