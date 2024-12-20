import './assets/css/main.scss'
import './assets/css/_fonts.scss'
import 'virtual:svg-icons-register';
import { initPromise } from '@/i18next';
/**
 * If you need single page
 */
import { app } from '@/app';
/**
 * If you need router
 */
// import { app } from '@/app-with-router';

initPromise.then(() => {
  app.mount('#app');
});
