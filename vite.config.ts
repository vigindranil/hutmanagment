import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/HMSRestAPI': {
        target: 'https://haatmgmtjpgzp.wb.gov.in',
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
    port: 5173
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

