<template>
	<Dialog v-model:visible="isInvited" modal :style="{ width: '35vw' }" :closeButtonProps="handleCloseButton">
		<template #header>
			You got an invitation from {{ invitorUsername }} to play pong!
		</template>
		<button class="custom-button-1" @click="confirm1()" icon="pi pi-check" label="Confirm">Accept</button>
		<button class="custom-button-1" @click="confirm2()" icon="pi pi-check" label="Delete">Decline</button>
	</Dialog>
	<MatchMaking v-if="showLoadingText" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { socket } from '@/utils/socket';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import MatchMaking from './MatchMaking.vue'
import axiosInstance from '@/utils/axiosConfig'
import { useRouter } from 'vue-router';
import {
	p1_id,
	p2_id,
	p1_socket_id,
	p2_socket_id,
	username1,
	username2,
	match_id,
	socket_match_id,
	} from './shared';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

// INVITE PEOPLE TO PLAY
const showLoadingText = ref(false);
const opponentId = parseInt(localStorage.getItem('playerId') || '0');
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
	socket.on('alreadyInMatch', () => {
			toast.add({ severity: 'info', summary: "You are in a match", detail: '', life: 3000 });
			router.push({ name: 'inviteMultiplayer' })
			return ;
		});
})

const startThisMatch = () => {
	socket.on('startMatch', async (match) => {
	try {
			showLoadingText.value = false;

			p1_id.value = match.player1.player_id;
			p2_id.value = match.player2.player_id;
			username1.value = await fetchUsername(match.player1.player_id);
			username2.value = await fetchUsername(match.player2.player_id);
			p1_socket_id.value = match.player1.socket_id;
			p2_socket_id.value = match.player2.socket_id;
			socket_match_id.value = match.matchId;
			match_id.value = match.data;

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
			router.push({ name: 'play' })
			socket.emit('acceptInvite', {p1_id: player_id.value, p1_socket_id: socket_id.value, p2_id: opponentId, p2_socket_id: socket.id},
			(response) => {
				if (response === 1)
					toast.add({ severity: 'error', summary: "Error starting match", detail: '', life: 3000 });
			});
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
    if (response.data)
        return response.data;
    return '0';
}

</script>

