import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/sepolia-blind-sign/",  // 使用环境变量动态配置base路径
  server: {
    port: 3000,
    strictPort: true
  },
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
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: 'index.html',
        404: 'public/404.html'
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
          if (id.includes("@components")) {
            return "components";
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
