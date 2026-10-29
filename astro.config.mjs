// @ts-check
import { defineConfig } from 'astro/config';

// TODO: set `site` once the domain is chosen; it enables canonical,
// hreflang and og:image URLs in Base.astro.
export default defineConfig({
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
