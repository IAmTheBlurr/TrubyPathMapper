import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@data': path.resolve(__dirname, 'src/data'),
            '@logic': path.resolve(__dirname, 'src/logic'),
            '@components': path.resolve(__dirname, 'src/components'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
    build: {
        target: 'esnext',
        sourcemap: true,
    },
});
