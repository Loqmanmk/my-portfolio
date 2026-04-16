import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
                    'emailjs-vendor': ['@emailjs/browser'],
                }
            }
        },
        chunkSizeWarningLimit: 600,
    }
})