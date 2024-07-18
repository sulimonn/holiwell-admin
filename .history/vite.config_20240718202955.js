import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://154.194.52.246:8000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/api/, '');
        },
      },
      '/auth': {
        target: 'http://154.194.52.246:8000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/auth/, '');
        },
      },
      '/files': {
        target: 'http://154.194.52.246',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/files/, ''),
      },
    },
  },
  preview: {
    port: 3000,
  },
});
