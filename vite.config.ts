import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Bundle report is opt-in: `ANALYZE=1 npm run build` (it used to rewrite a tracked file on every build).
    ...(process.env.ANALYZE
      ? [visualizer({
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          filename: 'bundle-analysis.html',
        })]
      : []),
    // Source map upload needs SENTRY_AUTH_TOKEN in the build environment; it is skipped without it.
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [sentryVitePlugin({
          org: "test-company-1v",
          project: "creators-ai",
          authToken: process.env.SENTRY_AUTH_TOKEN,
          telemetry: false,
        })]
      : []),
    VitePWA({
      registerType: 'autoUpdate', // auto-check for new SW
      includeAssets: ['public/*'],
      // The web manifest is the static public/manifest.json linked from index.html.
      manifest: false,
      workbox: {
        // Crawler files must never be answered with the SPA shell.
        // /guides/* are prerendered static pages; without this the app-shell fallback (registered before the
        // runtime routes below) would answer them with the landing page's HTML on repeat visits.
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/guides\//],
        runtimeCaching: [
          {
            // HTML → NetworkFirst, so visitors (and crawlers) get fresh pages and only fall back to cache offline
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
            },
          },
          {
            // JS, CSS, and workers → CacheFirst
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'worker',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Images and fonts → CacheFirst
            urlPattern: ({ request }) =>
              request.destination === 'image' ||
              request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['react-router-dom', 'react-i18next'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 200,
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: true,
  },
})
