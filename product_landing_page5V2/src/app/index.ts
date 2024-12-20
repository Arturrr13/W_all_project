import { createApp } from 'vue';
import App from '@/app/App.vue';
import { withPlugins } from '@/app-common';

const app = createApp(App);
withPlugins(app);

export { app };
