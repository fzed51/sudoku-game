import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
const basePath = '/sudoku-game/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      base: basePath,
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Sudoku Game',
        short_name: 'Sudoku',
        description: 'Jeu de Sudoku mobile-first avec plusieurs niveaux de difficulté.',
        id: basePath,
        start_url: basePath,
        scope: basePath,
        display: 'standalone',
        background_color: '#eff6ff',
        theme_color: '#1e3a5f',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
      },
    }),
  ],
})
