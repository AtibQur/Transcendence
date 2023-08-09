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
	<Toast/>
	<div>
		<ChatNotification />
	</div>
	<ConfirmDialog />
	<Dialog v-model:visible="isInvited" modal :style="{ width: '35vw' }" :closeButtonProps="handleCloseButton">
		<template #header>
			You got an invitation from {{ invitorUsername }} to play pong!
		</template>
		<button class="custom-button-1" @click="confirm1()" icon="pi pi-check" label="Confirm">Accept</button>
		<button class="custom-button-1" @click="confirm2()" icon="pi pi-check" label="Delete">Decline</button>
	</Dialog>
	<MatchMaking v-if="startMatch" />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { socket } from './socket';
import { setDefaultAuthHeader } from './axiosConfig';
import { useRouter } from 'vue-router';
import { getCookie } from './components/cookie_utils';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast'
import Menubar from './components/Menubar/Menubar.vue';
import FriendsMenubar from './components/Friends/FriendsMenubar/FriendsMenubar.vue';
import MatchMaking from '../src/components/pong/MatchMaking.vue'
import ChatNotification from './components/Chat/ChatNotification.vue';
import axiosInstance from './axiosConfig';

const router = useRouter();
const confirm = useConfirm();

// INVITE PEOPLE TO PLAY
const startMatch = ref(false);
const opponentId = parseInt(sessionStorage.getItem('playerId') || '0');
const isInvited = ref(false);
const player1 = ref(0);
const invitorUsername = ref("");

const player_id = ref(0);
const socket_id = ref(0);

onBeforeMount( () => {
	// send an invite to a player
	socket.on('sendInvite', async (data) => {
		player_id.value = data.player_id;
		socket_id.value = data.socket_id;
		isInvited.value = true
		invitorUsername.value = await fetchUsername(player_id.value);
	});
	// redirecting to a accepted match
	socket.on('redirecting', (data) => {
		startMatch.value = true;
	});
})

// ACCEPT INVITATION
const confirm1 = async () => {
	confirm.require({
		message: 'Do you want to accept the invitation?',
		header: 'Confirmation',
		accept: () => {
			socket.emit('acceptInvite', {p1_id: player_id.value, p1_socket_id: socket_id.value, p2_id: opponentId, p2_socket_id: socket.id},
			(response) => {
				console.log ("RESPONSE 2", response)
			});
			socket.emit('inviteAccepted', player_id.value)
			startMatch.value = true;
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
				socket.emit('declineInvite', player_id.value);
				isInvited.value = false;
			}
		})
};

// INVITE DIALOG
const openConfirmDialog = async () => {
	confirm.require({
		message: 'Are you sure you want to decline the invitation?',
		header: 'Confirmation',
		accept: () => {
			isInvited.value = false;
			socket.emit('declineInvite', player_id.value);
			console.log('decline invintation')
			socket.emit('declineInvite', {player1: player1.value});
		},
		onShow: () => {
			isInvited.value = true;
		}
	});
};

// CLOSE BUTTON
const handleCloseButton = {
	'aria-label': 'Close Dialog',
	onClick: () => {
	openConfirmDialog()
	},
};

// AUTH
const checkLoggedIn = async () => {
	const accesstoken = getCookie('auth');
	if (accesstoken === undefined) {
		router.push({ name: 'auth' })
		return;
	}
	setDefaultAuthHeader(accesstoken);
};

const fetchUsername = async (player_id: number) => {
	const response = await axiosInstance.get('player/username/' + player_id.toString());
	return response.data;
}

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
.p-confirm-dialog, .p-toast, .p-dialog {
	font-family: 'JetBrains Mono';
}
</style>
