import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import axiosInstance from './axiosConfig';
import App from './App.vue';
import Home from './components/Home.vue';
import Play from './components/pong/Play.vue';
import Auth from './components/Auth/AuthCheck.vue';
import Login from './components/Auth/AuthRedirect.vue';
import ProfilePage from './components/profile/ProfilePage.vue';
import Leaderboard from './components/LeaderboardComponent.vue';
import ProfileSettings from './components/profile/ProfileSettings.vue';
import PopulateDatabase from './components/PopulateDatabase.vue';
import ChatView from './components/Chat/ChatView.vue';

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
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/chat',
      component: ChatView,
    },
    {
      path: '/leaderboard',
      component: Leaderboard,
    },
    {
    path: '/populatedatabase',
    component: PopulateDatabase,
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/settings',
      component: ProfileSettings,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(router);
app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');