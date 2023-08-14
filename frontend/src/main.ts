import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import axiosInstance from './utils/axiosConfig';
import App from './App.vue';
import Home from './components/Home.vue';
import Play from './components/pong/Play.vue';
import Multiplayer from './components/pong/Multiplayer.vue';
import InviteMultiplayer from './components/pong/InviteMultiplayer.vue';
import Tfa from './components/Auth/Redirect2faVerify.vue';
import Auth from './components/Auth/AuthCheck.vue';
import Login from './components/Auth/AuthRedirectIf2fa.vue';
import ProfilePage from './components/profile/ProfilePage.vue';
import Leaderboard from './components/LeaderboardComponent.vue';
import ChatView from './components/Chat/ChatView.vue';
import Redirect2faVerify from './components/Auth/AuthRedirectIf2fa.vue';
import FriendsPage from './components/Friends/FriendsMenubar/FriendsPage.vue';
import TfaConfirm from './components/Auth/TfaConfirm.vue';
import WrongTfa from './components/Auth/WrongTfa.vue';
import WelcomePage from './components/profile/WelcomePage.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import createCookies from 'vue3-cookies';

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
		path: '/play/multiplayer',
		name: 'multiplayer',
		component: Multiplayer,
	},
	{
		path: '/play/multiplayer',
		name: 'inviteMultiplayer',
		component: InviteMultiplayer,
	},
    {
      path: '/2fa',
      name: '2fa',
      component: Tfa,
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/tfaconfirm',
      name: 'TFA_CONFIRM',
      component: TfaConfirm,
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
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/friends',
      component: FriendsPage,
    },
    {
      path: '/redirect2faverify',
      name: "TFA_VERIFY",
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
      name: 'welcome',
      path: '/welcome',
      component: WelcomePage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);

app.use(createCookies)


app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');