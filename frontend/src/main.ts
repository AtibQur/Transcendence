import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import axiosInstance from './axiosConfig';
import App from './App.vue';
import Home from './components/Home.vue';
import Play from './components/pong/Play.vue';
import Auth from './components/Auth/AuthCheck.vue';
import Login from './components/Auth/AuthRedirectIf2fa.vue';
import ProfilePage from './components/profile/ProfilePage.vue';
import Leaderboard from './components/LeaderboardComponent.vue';
import PopulateDatabase from './components/PopulateDatabase.vue';
import ChatView from './components/Chat/ChatView.vue';
import Redirect2faVerify from './components/Auth/AuthRedirectIf2fa.vue';
import FriendsPage from './components/Friends/FriendsMenubar/FriendsPage.vue';
import PlayerProfile from './components/profile/PlayerProfile.vue';
import WrongTfa from './components/Auth/WrongTfa.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import createCookies from 'vue3-cookies';
import Logout from './components/LogoutPlayer.vue';

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
      name: 'auth',
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
      path: '/friends',
      component: FriendsPage,
    },
    {
      path: '/redirect2faverify',
      component: Redirect2faVerify,
    },
    {
      path: '/wrong2fa',
      component: WrongTfa
    },
    {
      name: 'friends',
      path: '/profile/:playerName',
      component: FriendsPage,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);

app.use(createCookies)


app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');