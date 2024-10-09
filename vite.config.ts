import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mima-live/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', 'vue-router'],
      dirs: [
        './composables/**',
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true, // enabled by default if `typescript` is installed
    }),
  ],
});
