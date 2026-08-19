import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true expone el servidor en la red local,
    // para poder abrirlo desde el celular (PLAN.md fase 1)
    host: true,
  },
})
