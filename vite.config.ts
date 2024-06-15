import vue from '@vitejs/plugin-vue';
import net from 'node:net';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// work around a node v20 bug: https://github.com/nodejs/node/issues/47822#issuecomment-1564708870
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://novi.mivik.moe/api',
        // target: 'http://127.0.0.1:1879',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
