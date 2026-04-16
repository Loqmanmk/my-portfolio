import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'react-vendor'
                    }
                    if (id.includes('node_modules/firebase')) {
                        return 'firebase-vendor'
                    }
                    if (id.includes('node_modules/@emailjs')) {
                        return 'emailjs-vendor'
                    }
                }
            }
        },
        chunkSizeWarningLimit: 600,
    }
})