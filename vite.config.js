import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Bangkok Noodles',
        short_name: 'Bangkok',
        description: 'Pide tu comida tailandesa favorita',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#FF6B00',
        background_color: '#111111',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        // CRÍTICO para SPA PWA: sirve index.html para cualquier ruta de navegación
        // que no esté en el precache (ej. /customer/menu, /worker/dashboard)
        navigateFallback: 'index.html',
        // No aplicar el fallback a rutas de API
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            // Supabase API — network-first, TTL corto
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5, // 5 minutos
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
