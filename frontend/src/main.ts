import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import Play from './components/Play.vue';
import Auth from './components/Auth/AuthCheck.vue';

const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/play',
      component: Play,
    },
    {
      path: '/auth',
      component: Auth,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(router);
app.mount('#app');