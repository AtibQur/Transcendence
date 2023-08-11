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
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import MatchMaking from './MatchMaking.vue'
import axiosInstance from '../../axiosConfig';
import { useRouter } from 'vue-router';
import {
	p1_id,
	p2_id,
	p1_socket_id,
	p2_socket_id,
	match_id,
	socket_match_id,
	} from './shared';

// const p1_id = ref<number>(0);
// const p2_id = ref<number>(0);
// const p1_socket_id = ref<string>('');
// const p2_socket_id = ref<string>('');
// const username1 = ref<string>('');
// const username2 = ref<string>('');
// const match_id = ref<number>(0);
// const socket_match_id = ref<number>(0);

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

// INVITE PEOPLE TO PLAY
const startMatch = ref(false);
const opponentId = parseInt(sessionStorage.getItem('playerId') || '0');
const isInvited = ref(false);
const player1 = ref(0);
const invitorUsername = ref("");

const player_id = ref(0);
const socket_id = ref(0);

onBeforeMount( () => {
	startThisMatch()
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
	socket.on('alreadyInMatch', () => {
			toast.add({ severity: 'info', summary: "You are in a match", detail: '', life: 3000 });
			router.push({ name: 'inviteMultiplayer' })
			return ;
		});

})

const startThisMatch = () => {
	socket.on('startMatch', async (match) => {
	try {
			const { player1, player2 } = match;
			console.log("P1:", player1)
			console.log("P2:", player2)

			p1_id.value = match.player1.player_id;
			p2_id.value = match.player2.player_id;
			p1_socket_id.value = match.player1.socket_id;
			p2_socket_id.value = match.player2.socket_id;
			socket_match_id.value = match.matchId;

			if (player1.socket_id === socket.id) {
				// Player 1's logic
				console.log('I am player 1, ID:', player1.player_id);
				console.log('Opponent player ID:', player2.player_id);
				//starting match saves here
				const match_id_response = await axiosInstance.post('match/create', {player_id: p1_id.value, opponent_id: p2_id.value});
				match_id.value = match_id_response.data.id;
			} else if (player2.socket_id === socket.id) {
				// Player 2's logic
				console.log('I am player 2, ID:', player2.player_id);
				console.log('Opponent player ID:', player1.player_id);
			}
		
			console.log("MatchId:", socket_match_id.value)
		router.push({ name: 'inviteMultiplayer' })
	} catch (error) {
		console.log('Error starting match')
	}
	});
}

// ACCEPT INVITATION
const confirm1 = async () => {
	confirm.require({
		message: 'Do you want to accept the invitation?',
		header: 'Confirmation',
		accept: () => {
			socket.emit('acceptInvite', {p1_id: player_id.value, p1_socket_id: socket_id.value, p2_id: opponentId, p2_socket_id: socket.id},
			(response) => {
				if (response === 1)
					toast.add({ severity: 'error', summary: "Error starting match", detail: '', life: 3000 });
			});
			socket.emit('inviteAccepted', player_id.value)
			// startMatch.value = true;
			startThisMatch()
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

