import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'https://api.shop.strackit.com',
        changeOrigin: true,
        secure: false,
      },
      '/ALUMNI': {
        target: 'https://you.strackit.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
