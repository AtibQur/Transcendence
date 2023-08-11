<template>
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
import { onBeforeMount, ref } from 'vue'
import { socket } from '../../socket';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import MatchMaking from '../pong/MatchMaking.vue'
import axiosInstance from '../../axiosConfig';

const confirm = useConfirm();

// INVITE PEOPLE TO PLAY
const startMatch = ref(false);
const opponentId = parseInt(localStorage.getItem('playerId') || '0');
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
	socket.on('redirecting', () => {
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

const fetchUsername = async (player_id: number) => {
	const response = await axiosInstance.get('player/username/' + player_id.toString());
	return response.data;
}

</script>

