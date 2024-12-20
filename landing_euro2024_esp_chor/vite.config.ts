import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let define = {};
  if (command === 'serve') {
    define = Object.assign(define, {
      globalParams: {
        DOMAIN: 'https://example.com/',
        PARAM1: 'test_param1',
        PARAM2: 'test_param2',
        PARAM3: 'test_param3',
        PARAM4: 'test_param4',
      },
    });
  }
  return {
    css: {
      preprocessorOptions: {
          scss: {
              additionalData: `@import "./src/assets/css/addStyles.scss";`,
          },
      },
    },
    base: '',
    envPrefix: 'VUE_APP_',
    define,
    plugins: [
      vue(),
      /**
       * Import svg as vue component
       */
      svgLoader(),
      /**
       * Make svg sprite
       */
      createSvgIconsPlugin({
        iconDirs: [
          fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
        ],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
