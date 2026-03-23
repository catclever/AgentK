import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@agent-k/core': resolve(__dirname, '../../core/src')
    }
  },
  define: {
    global: 'window', // Polyfill for RxDB/PouchDB in browser
  }
})
