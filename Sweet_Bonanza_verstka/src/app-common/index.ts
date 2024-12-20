import type { App } from 'vue';
// import { createPinia } from 'pinia';
import I18NextVue from 'i18next-vue';
import { i18n } from '@/i18next';
import { createHead } from '@vueuse/head';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export const withPlugins = (app: App) => {
  /**
   * If you need global state
   */
  // app.use(createPinia());

  app.use(createHead());
  app.use(Toast);
  app.use(I18NextVue, {
    i18next: i18n,
  });
};
