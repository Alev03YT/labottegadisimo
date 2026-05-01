import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/labottegadisimo/',
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  plugins: [react()],
})
