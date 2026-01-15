import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/haatmanagement',
  plugins: [react()],
  server: {
    proxy: {
      '/HMSRestAPI': {
        target: 'https://vigpl.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

