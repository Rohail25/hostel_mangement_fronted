import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    // Fallback to index.html for client-side routing
    proxy: {
      '/admin': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        bypass: () => '/index.html'
      }
    }
  }
})
