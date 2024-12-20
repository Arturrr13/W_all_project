import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/LandPage.vue'),
    },
    {
      path: '/sub',
      name: 'sub',
      component: () => import('@/components/SubPage.vue'),
    },
  ],
});

export default router;
