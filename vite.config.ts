import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:Number(process.env.VITE_CLIENT_PORT) || 6000,
    proxy:{
      '/api':`${process.env.VITE_EXPRESS_API_BASE_URI}`
    }
  }
})
