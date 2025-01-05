import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
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
    vueJSX(),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        'pinia',
        {
          from: 'mima-kit',
          imports: [
            'FpECPoint',
            'ECKeyPair',
          ],
          type: true,
        },
      ],
      dirs: [
        './src/composables/**',
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true, // enabled by default if `typescript` is installed
    }),
  ],
});
