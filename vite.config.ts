import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
  css: {
    transformer: 'postcss',
    postcss: {
      plugins: [
        autoprefixer({ remove: false })
      ]
    }
  }
})


// vite.config.ts
    // export default defineConfig({
    //   css: {
    //     lightningcss: undefined,  // disable lightning css
    //     devSourcemap: true,
    //   },
    //   build: {
    //     cssMinify: 'esbuild'  // استخدم esbuild بدل lightning css
    //   }
    // })