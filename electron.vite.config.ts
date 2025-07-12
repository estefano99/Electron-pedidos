import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
     build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
     build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    plugins: [react()],
     build: {
      outDir: 'dist/renderer'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/renderer/src')
      }
    }
  }
})
