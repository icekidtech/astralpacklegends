import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase from default 500kb
    // Alternatively, use rollupOptions for better chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@rainbow-me/rainbowkit']
        }
      }
    }
  }
})
