import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiProxy = {
  '/health': 'http://localhost:5000',
  '/register': 'http://localhost:5000',
  '/login': 'http://localhost:5000',
  '/notes': 'http://localhost:5000',
  '/me': 'http://localhost:5000',
  '/logout': 'http://localhost:5000',
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: apiProxy,
  },
})
