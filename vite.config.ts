import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/WebProxySearch/',  // <-- this is important for GitHub Pages
  plugins: [react()],
  build: {
    // optional: you can customize things here
    outDir: 'dist',
  },
})
