// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, 
  historyApiFallback:true,
  build: {
    // Menetapkan batas peringatan menjadi lebih tinggi (opsional)
    // chunkSizeWarningLimit: 1000, 
    
    // Konfigurasi Rollup untuk memecah vendor dan library besar
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Pisahkan node_modules ke dalam chunk 'vendor'
          if (id.includes('node_modules')) {
            // Anda bisa memecahnya lebih lanjut (misal: react, numeric-format)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
                return 'vendor-router';
            }
            // Sisanya masuk ke vendor umum
            return 'vendor';
          }
        },
      },
    },
    },
  }
})