import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      protocol: 'ws'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    {
      name: 'copy-routes-file',
      writeBundle() {
        // Create _routes.json for Cloudflare Workers SPA routing
        const routesConfig = {
          version: 1,
          include: ["/*"],
          exclude: [
            "/assets/*",
            "/*.js",
            "/*.css",
            "/*.png",
            "/*.jpg",
            "/*.jpeg",
            "/*.gif",
            "/*.svg",
            "/*.ico",
            "/*.woff",
            "/*.woff2",
            "/*.ttf",
            "/*.eot",
            "/*.json",
            "/*.xml",
            "/*.txt",
            "/*.pdf",
            "/sw.js",
            "/manifest.json",
            "/robots.txt",
            "/browserconfig.xml"
          ]
        };
        
        const routesPath = path.resolve('dist/_routes.json');
        fs.writeFileSync(routesPath, JSON.stringify(routesConfig, null, 2));
        console.log('✅ Created _routes.json for Cloudflare Workers SPA routing');
      }
    }
  ],
})
