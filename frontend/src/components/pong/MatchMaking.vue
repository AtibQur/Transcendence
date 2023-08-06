<template>
	<h1 class="loading-text">
		Finding players <span class="loading-dots">{{ animatedDots }}</span>
	</h1>
</template>

<script lang="ts">
	export let p1_id: number
	export let p2_id: number
	export let p1_socket_id = ''
	export let p2_socket_id = ''
	export let username1 = ''
	export let username2 = ''
	export let match_id: number
	export let socket_match_id: number;

	import { onMounted, onBeforeMount, ref, computed} from 'vue'
	import { useRouter } from 'vue-router'
	import { socket } from '../../socket'
	import axiosInstance from '../../axiosConfig'
	import { useToast } from 'primevue/usetoast';

export default {
	name: 'MatchMaking',
	setup() {
		const toast = useToast();
		const matchSaved = ref(false);
		const router = useRouter(1);
		const player = {
			id: 0,
			socket_id: '',
		};
		// dots animation
		const dotsCount = ref(1);
		const animateDots = () => {
			setInterval(() => {
				dotsCount.value = (dotsCount.value % 3) + 1;
		}, 1000);
	};
	const animatedDots = computed(() => {
		return '.'.repeat(dotsCount.value);
	});
	onMounted(() => {
		animateDots();
	});

	onBeforeMount(async () => {
		player.id = parseInt(sessionStorage.getItem('playerId') || '0');
		player.socket_id = socket.id;
		sessionStorage.setItem('socketID', player.socket_id);
		console.log(player.socket_id)
		socket.emit('joinMatchmaking', {player_id: player.id, socket_id: player.socket_id});
	});

	const fetchUsername = async (player_id: number) => {
		const response = await axiosInstance.get('player/username/' + player_id.toString());
		return response.data;
	};

	socket.on('connection', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected');
	}

	socket.on('startMatch', async (match) => {
	try {
		if (!matchSaved.value){
			const { player1, player2 } = match;
			console.log("P1", player1)
			console.log("P2", player2)
			

			p1_id = match.player1.player_id;
			p2_id = match.player2.player_id;
			p1_socket_id = match.player1.socket_id;
			p2_socket_id = match.player2.socket_id;
			socket_match_id = match.matchId;

			if (player1.socket_id === socket.id) {
				// Player 1's logic
				console.log('I am player 1');
				console.log('My player ID:', player1.player_id);
				console.log('Opponent player ID:', player2.player_id);

				//starting match saves here
				const match_id_response = await axiosInstance.post('match/create', {player_id: p1_id, opponent_id: p2_id});
				match_id = match_id_response.data.id;
			} else if (player2.socket_id === socket.id) {
				// Player 2's logic
				console.log('I am player 2');
				console.log('My player ID:', player2.player_id);
				console.log('Opponent player ID:', player1.player_id);
			}
		
			console.log("FRONT END MatchId", socket_match_id)
			// console.log(match.p1, 'and', match.p2, 'are in a match');
			
			// username1 = await fetchUsername(p1_id);
			// username2 = await fetchUsername(p2_id);

			matchSaved.value = true;
		}
		router.push({ name: 'multiplayer' })
	} catch (error) {
		console.log('Error starting match')
	}
	});

	socket.on('alreadyInMatch', () => {
		console.log("you are already in a match, redirecting...")
		router.push('/play/multiplayer');
	});

	return {
		animatedDots,
		};
	},
};
</script>

<style>
.loading-text {
  position: relative;
  color: #134279;
}

.loading-dots {
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  animation: loadingAnimation 1s infinite;
  opacity: 100%;
  font-size: 40px;
}

@keyframes loadingAnimation {
  100% {
	opacity: 1;
  }
}

.circle-container {
  display: flex;
}

</style>
