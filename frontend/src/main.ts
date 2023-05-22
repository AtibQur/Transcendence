import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import Game from './components/pong/Game.vue';

const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: Home,
    },
    // {
    //   path: '/about',
    //   component: About,
    // },
	{
		path: '/game',
		component: Game,
	},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(router);
app.mount('#app');