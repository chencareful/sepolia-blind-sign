import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/sepolia-blind-sign/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@assets": "/src/assets"
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});
