import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/sepolia-blind-sign/" : "/",  // 关键修改：确保 base 在生产环境正确
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
