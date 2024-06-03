import { onActivated } from 'vue';
import { createRouter, createWebHistory, useRoute } from 'vue-router';

import HomePage from '@/page/HomePage.vue';

export let persistedPositions: Record<string, { left: number; top: number }> = {};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/object/:id',
      name: 'object',
      component: () => import('@/page/ObjectPage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/page/SettingsPage.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/page/DemoPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/page/LoginPage.vue')
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    return {
      left: window.scrollX,
      top: window.scrollY
    }
  }
});

router.beforeEach((_to, from, next) => {
  if (from.meta.keepAlive)
    persistedPositions[from.name as string] = {
      left: window.scrollX,
      top: window.scrollY
    };
  next();
});

export default router;
