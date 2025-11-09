import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase chunk size warning limit to 600KB (from default 500KB)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better code splitting
        manualChunks: (id) => {
          // Vendor chunks - split large libraries into separate chunks
          if (id.includes('node_modules')) {
            // PDF libraries - split separately (very large)
            if (id.includes('jspdf')) {
              return 'vendor-jspdf';
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            // Recharts (charts library - very large)
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            // Framer Motion (animations)
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-react-router';
            }
            // React Hook Form
            if (id.includes('react-hook-form')) {
              return 'vendor-react-hook-form';
            }
            // Zod (validation)
            if (id.includes('zod')) {
              return 'vendor-zod';
            }
            // Heroicons
            if (id.includes('@heroicons')) {
              return 'vendor-heroicons';
            }
            // Axios
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
            // React core libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // All other node_modules
            return 'vendor-other';
          }
        },
      },
    },
  },
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
