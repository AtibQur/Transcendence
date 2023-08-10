<template>
	<Menubar />
	<router-view />
	<Toast/>
	<ConfirmDialog />
	<template v-if="sessionVariablesAreSet">
		<FriendsMenubar />
		<ChatNotification />
		<GameInvitation />
	</template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { setDefaultAuthHeader } from './axiosConfig';
import { useRouter } from 'vue-router';
import { getCookie } from './components/cookie_utils';
import { socket } from '@/socket';
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog';
import Menubar from './components/Menubar/Menubar.vue';
import FriendsMenubar from './components/Friends/FriendsMenubar/FriendsMenubar.vue';
import GameInvitation from './components/pong/GameInvitation.vue'
import ChatNotification from './components/Chat/ChatNotification.vue';
import axiosInstance from './axiosConfig';

const router = useRouter();
const sessionVariablesAreSet = ref(false);

// AUTH
const checkLoggedIn = async () => {
	const accesstoken = getCookie('auth');
	if (accesstoken === undefined) {
		router.push({ name: 'auth' })
		console.log('not logged?')
		return;
	}
	setDefaultAuthHeader(accesstoken);
};

onMounted( async () => {
	const accesstoken = getCookie('auth');
	if (accesstoken === undefined) {
		checkLoggedIn();
	}
	else {
		setDefaultAuthHeader(accesstoken);
		// load intraname from cookie, done after intra login auth
		const responsePlayerId = await axiosInstance.get('/user/id');
		const responseIntraname = await axiosInstance.get('/user/intraname');
		const responseUsername = await axiosInstance.get('/user/username');
		const hasAvatar = await axiosInstance.get('player/hasavatar/' + responsePlayerId.data);

		const playerId = parseInt(responsePlayerId.data);

		// set data in session storage
		sessionStorage.setItem('playerId', responsePlayerId.data);
		sessionStorage.setItem('intraUsername', responseIntraname.data);
		sessionStorage.setItem('username', responseUsername.data);
		sessionVariablesAreSet.value = true;

		// set default avatar
		if (!hasAvatar.data) {
			setDefaultAvatar(responsePlayerId.data);
		}

		socket.auth = { id: playerId };
		socket.connect();
	}
	})

	const setDefaultAvatar = async (playerId: string) => {
		const randomDecimal = Math.random() ;
		const randomNumber = Math.floor(randomDecimal * 7) + 1;
		const defaultAvatarPath = './default_avatars/avatar_' + randomNumber + '.png';

		// Fetch the default avatar file
		const defaultAvatarFile = await fetch(defaultAvatarPath);
		const defaultAvatarBlob = await defaultAvatarFile.blob();
		const defaultAvatar = new File([defaultAvatarBlob], 'default_avatar.png');

		// Send the default avatar file to the server
		const formData = new FormData();
		formData.append('avatar', defaultAvatar);

		console.log("avatar: ", defaultAvatarBlob);
		console.log("playerid: ", playerId);
		await axiosInstance.post('player/avatar/upload/' + playerId, formData);
	};

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=JetBrains+Mono');

html,
body,
#app {
	padding: 0;
	margin: 0;
	height: 100%;
}

#app {
	font-family: 'JetBrains Mono';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}

:root {
	--white-softblue: #f9fbfc;
	--white-softgray: #f0f0f0;
	--white-transparent: rgba(255, 255, 255, 0.6);
	--white-moretransparent: rgba(255, 255, 255, 0.3);
	--black-soft: #30333d;
	--blue-dark: #134279;
	--blue-dark-transparent: rgba(31, 96, 145, 0.5);
	--blue-dark-hover: rgb(31, 96, 145);
	--blue-medium: #1f6091;
	--blue-mediumlight: #76aabc;
	--blue-light: #B2DAE7;
	--blue-lighter: #c9e9f4;
	--blue-lightest: #d7eff7;
	--gray-blue-medium: #7b99a3;
	--gray-shadow: #a29e9e;
	--gray-dark: #525151;
	--gray-medium: #777777;
	--gray-light: #e4e4e4;
	--red-soft: #e74545;
	--green-soft: #74c23c;
	--red-light: #f0a1a1;
	--green-light: #b7ef94;
	--yellow-soft: #ffec8c9e;
}
.p-confirm-dialog, .p-toast, .p-dialog {
	font-family: 'JetBrains Mono';
}
</style>
