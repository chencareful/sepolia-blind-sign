import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "./",  // 👈 这里使用你的 GitHub 仓库名
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});
