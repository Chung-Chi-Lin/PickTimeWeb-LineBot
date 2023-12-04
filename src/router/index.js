import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: () => import('../views/logIn.vue'),
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: () => import('../views/signUp.vue'),
  },
  {
    path: '/todoList',
    name: 'todoList',
    component: () => import('../views/todoList.vue'),
    props: (route) => route.params,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
