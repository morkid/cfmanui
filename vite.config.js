import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: './',
  server: {
    port: 3000,
    proxy: {
      '/client': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/oauth': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/roles': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/audit': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
