<template>
	<div>
		<Menubar />
	</div>
	<div>
		<router-view />
	</div>
	<div>
		<FriendsMenubar />
	</div>
	<Dialog v-model:visible="isInvited" modal header="You got an invitation!" :style="{ width: '35vw' }" :closeButtonProps="handleCloseButton">
		<button class="custom-button-1" @click="confirm1()" icon="pi pi-check" label="Confirm">Accept</button>
		<button class="custom-button-1" @click="confirm2()" icon="pi pi-check" label="Delete">Decline</button>
	</Dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { socket } from './socket';
import Menubar from './components/Menubar/Menubar.vue';
import FriendsMenubar from './components/Friends/FriendsMenubar/FriendsMenubar.vue';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import { onMounted } from 'vue';
import { setDefaultAuthHeader } from './axiosConfig';
import { useRouter } from 'vue-router';
import { getCookie } from './components/cookie_utils';

const router = useRouter();
const confirm = useConfirm();

// INVITE PEOPLE TO PLAY
const opponentId = parseInt(sessionStorage.getItem('playerId') || '0');
const isInvited = ref(false);

onBeforeMount( () => {
	socket.on('sendInvite', (data) => {
		const p1 = data.player_id;
		const p2 = data.opponent_id;
		const p1_socket_id = data.socket_id;
		isInvited.value = true
		console.log('you got an invitation')
	});
})
// ACCEPT INVITATION
const confirm1 = async () => {
	confirm.require({
		message: 'Do you want to accept the invitation?',
		header: 'Confirmation',
		accept: () => {
			console.log('accept invintation')
			// socket.emit('acceptInvite');
			isInvited.value = false;
		}
	})
};
// DECLINE INVITATION
const confirm2 = async () => {
		confirm.require({
			message: 'Do you want to decline the invitation?',
			header: 'Confirmation',
			accept: () => {
				console.log('decline invintation')
				// socket.emit('declineInvite');
				isInvited.value = false;
			}
		})
};

const openConfirmDialog = () => {
	confirm.require({
		message: 'Are you sure you want to decline the invitation?',
		header: 'Confirmation',
		accept: () => {
			isInvited.value = false;
			console.log('decline invintation')
		},
		onShow: () => {
			isInvited.value = true;
		}
	});
};

const handleCloseButton = {
	'aria-label': 'Close Dialog',
	onClick: () => {
	openConfirmDialog()
	},
};

const checkLoggedIn = async () => {
	const accesstoken = getCookie('auth');
	if (accesstoken === undefined) {
		router.push({ name: 'auth' })
		return;
	}
	setDefaultAuthHeader(accesstoken);
};

onMounted(() => {
	const accesstoken = getCookie('auth');
	if (accesstoken === undefined) {
		checkLoggedIn();
	} else {
		setDefaultAuthHeader(accesstoken);
	}
	})
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
</style>
