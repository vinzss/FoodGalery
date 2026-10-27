import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Teruskan request /api ke backend Express (server/index.js) agar
    // cookie sesi tetap same-origin dan tidak perlu konfigurasi CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
