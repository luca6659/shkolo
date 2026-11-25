import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'
import { inspectAttr } from 'kimi-plugin-inspect-react'

export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['mascot.svg'],
      manifest: {
        name: 'школо! — english, но по кайфу',
        short_name: 'школо!',
        description: 'Английский через разговоры, челленджи и реальные ситуации',
        theme_color: '#173f32',
        background_color: '#f7f6ef',
        display: 'standalone',
        lang: 'ru',
        start_url: './',
        icons: [
          { src: 'mascot.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'mascot.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: undefined,
        globPatterns: ['**/*.{js,css,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [{ urlPattern: ({ request }) => request.mode === 'navigate', handler: 'NetworkOnly' }],
      },
    }),
  ],
  server: { port: 3000 },
  build: { emptyOutDir: false },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
