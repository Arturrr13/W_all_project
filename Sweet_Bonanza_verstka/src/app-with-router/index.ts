import { createApp } from 'vue';
import App from '@/app-with-router/App.vue';
import router from '@/app-with-router/router';
import { withPlugins } from '@/app-common';

const app = createApp(App);
withPlugins(app);

app.use(router);

export { app };
