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
      // apple-touch-icon.png EXCLUIDO del precache a propósito — ver regla NetworkOnly abajo
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Bangkok Noodles',
        short_name: 'Bangkok',
        description: 'Pide tu comida tailandesa favorita — noodles & street food',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#111111',
        background_color: '#111111',
        lang: 'es',
        categories: ['food', 'lifestyle'],
        icons: [
          // 192×192 — requerido por Chrome Android para el banner de instalación
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          // 180×180 — tamaño preferido por iOS
          {
            src: 'icons/icon-180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          // 512×512 — splash screen en Android y pantalla de instalación
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          // Maskable — para Android adaptive icons (fondo recortado en círculo/squircle)
          // purpose separado del 'any' para mejor compatibilidad
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precachear todos los assets de Vite
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        // CRÍTICO para SPA: el SW sirve index.html para rutas de React Router
        navigateFallback: 'index.html',
        // Excluir rutas de API del fallback
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            // CRÍTICO para iOS: el SW nunca intercepta el icono de pantalla de inicio.
            // Sin esto, si el SW precacheó una respuesta mala (HTML del SPA fallback
            // cuando el archivo no existía), serviría HTML para siempre en lugar del PNG.
            urlPattern: /\/apple-touch-icon\.png$/,
            handler: 'NetworkOnly',
          },
          {
            // Supabase — network-first, caché de 5 min como fallback offline
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Google Fonts — cache-first (las fuentes no cambian)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
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
