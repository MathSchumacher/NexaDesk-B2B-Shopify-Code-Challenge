import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/deepl': {
        target: 'https://api-free.deepl.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl/, ''),
      },
    },
  },
})
