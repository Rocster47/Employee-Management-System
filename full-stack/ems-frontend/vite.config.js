import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: fs.readFileSync('C:/Windows/System32/cert.crt'),
      key: fs.readFileSync('C:/Windows/System32/cert.key')
    },
    port: 3000
  }
});
