import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import Play from './components/PlayGame.vue';
import Leaderboard from './components/LeaderboardComponent.vue';

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
      path: '/leaderboard',
      component: Leaderboard,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(router);
app.mount('#app');