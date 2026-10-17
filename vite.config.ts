import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Writes robots.txt and sitemap.xml into the build when VITE_SITE_URL is set
 * (e.g. VITE_SITE_URL=https://acm.example.edu in a .env.production file).
 */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'acm-seo-files',
    apply: 'build',
    generateBundle() {
      const base = siteUrl.replace(/\/+$/, '');
      const robots = base
        ? `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      if (base) {
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc><lastmod>${today}</lastmod></url>\n  <url><loc>${base}/upcoming.html</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Relative base so the build works in public_html or any sub-folder.
    base: './',
    plugins: [react(), seoFiles(env.VITE_SITE_URL ?? '')],
    build: {
      assetsDir: 'static',
      assetsInlineLimit: 2048,
      cssCodeSplit: false,
      // Two pages: the scrolling home page and the standalone upcoming-events page.
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          upcoming: resolve(__dirname, 'upcoming.html'),
        },
      },
    },
  };
});
