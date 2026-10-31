import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/link': path.resolve(__dirname, './src/lib/next-shims.tsx'),
      'next/image': path.resolve(__dirname, './src/lib/next-shims.tsx'),
      'next/navigation': path.resolve(__dirname, './src/lib/next-navigation-shim.ts'),
      'next-intl': path.resolve(__dirname, './src/context/I18nContext.tsx'),
      'next-auth/react': path.resolve(__dirname, './src/lib/next-auth-shim.tsx'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
})
