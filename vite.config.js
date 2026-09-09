import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('jspdf') || id.includes('pdfjs-dist') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('xlsx') || id.includes('papaparse')) {
              return 'vendor-data';
            }
            if (id.includes('jszip') || id.includes('file-saver')) {
              return 'vendor-zip';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
})

