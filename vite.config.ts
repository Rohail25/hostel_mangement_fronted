import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase chunk size warning limit to 600KB (from default 500KB)
    chunkSizeWarningLimit: 600,
    // Ensure proper module format for production
    target: 'esnext',
    minify: 'esbuild',
    // Source maps for debugging (can be disabled in production)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Ensure proper chunk format
        format: 'es',
        // Manual chunk splitting - only split very large libraries
        // Let Vite handle smaller libraries automatically to avoid initialization issues
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core - always separate
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Very large libraries that should be split
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            // Let Vite automatically handle the rest to avoid circular dependency issues
            // This includes react-hook-form, zod, @hookform/resolvers, etc.
            // They'll be grouped automatically by Vite based on actual dependencies
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
