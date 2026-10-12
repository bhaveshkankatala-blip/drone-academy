import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // relative paths: works on Netlify, GitHub Pages sub-paths and offline
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
