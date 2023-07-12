<template>
	<h1 class="loading-text">
		Finding players <span class="loading-dots">{{ animatedDots }}</span>
	</h1>
	<!-- <div class="circle-container">
		<div class="circle circle1"></div>
		<div class="circle circle2"></div>
		<div class="circle circle3"></div>
	</div> -->
</template>

<script lang="ts">
	export let p1_id: number
	export let p2_id: number
	export let p1_socket_id = ''
	export let p2_socket_id = ''
	export let username1 = ''
	export let username2 = ''
	export let match_id: number

	import { onMounted, onBeforeMount, ref, computed} from 'vue'
	import { useRouter } from 'vue-router'
	import { socket } from '../../socket'
	import axiosInstance from '../../axiosConfig'

export default {
	name: 'MatchMaking',
	setup() {
		const beginMatch = ref(false);
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
		console.log(socket.id)
		console.log(player)

		const { p1, p2 } = match;
		if (p1.socket_id === socket.id) {
			// Player 1's logic
			console.log('I am player 1');
			console.log('My player ID:', p1.player_id);
			console.log('Opponent player ID:', p2.player_id);
		} else if (p2.socket_id === socket.id) {
			// Player 2's logic
			console.log('I am player 2');
			console.log('My player ID:', p2.player_id);
			console.log('Opponent player ID:', p1.player_id);
		}

		p1_id = match.p1.player_id;
		p2_id = match.p2.player_id;
		p1_socket_id = match.p1.socket_id;
		p2_socket_id = match.p2.socket_id;
		console.log(match.p1, 'and', match.p2, 'are in a match');

		username1 = await fetchUsername(p1_id);
		username2 = await fetchUsername(p2_id);
		// console.log("p1:", username, "p2:", opponent)

		// hier wordt match gestart
		// const match_id_response = await axiosInstance.post('match/create', {player_id: p1_id, opponent_id: p2_id});
		// match_id = match_id_response.data.id;
		// console.log("MATCH ID", match_id)
			router.push('/play/multiplayer');
	} catch (error) {
		console.log('Error starting match')
	}
	});
	return {
		beginMatch,
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

/* .circle {
  position: relative;
  margin-right: 10px;
  top: 20px;
  left: 49%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #134279;
  transform: translate(-50%, -50%);
  /* animation-duration: 1s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
} */

/* .circle1 {
  animation-name: moveUpDown1;
  animation-delay: 0s;
}

.circle2 {
  animation-name: moveUpDown2;
  animation-delay: 0.25s;
}

.circle3 {
  animation-name: moveUpDown3;
  animation-delay: 0.5s;
} */

/* .circle4 {
  animation-name: moveUpDown4;
  animation-delay: 0.5s;
} */

/* @keyframes moveUpDown1 {
  0%, 100% {
    transform: translateY(0);
  }
  10% , 90%{
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }
}

@keyframes moveUpDown2 {
  0%, 100% {
    transform: translateY(0);
  }
  10% , 90%{
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }
}

@keyframes moveUpDown3 {
  0%, 100% {
    transform: translateY(0);
  }
  10% , 90%{
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }
} */

</style>
  






<!-- <template>
	<h1>Finding players...</h1>
	<div class="containter">
		<div class="text-wrapper">
			<h1 class="text">{{ dynamicText1 }}</h1>
			<h1 class="text">VS</h1>
			<h1 class="text">{{ dynamicText2 }}</h1>
		</div>
	</div>
</template>

<script lang="ts">
import { socket } from '../../socket'
import axiosInstance from '../../axiosConfig';
import { defineComponent, onBeforeMount } from 'vue'

export default defineComponent({
	name: "MatchMaking",
	components: {},
data() {
	return {
		beginMatch: false,
		showMatch: false,
		dynamicText1: 'player1',
		dynamicText2: 'player2',
	};
},
methods: {
	startMatch(){
		console.log('redirecting')
		this.beginMatch = true
		this.$router.push('/play/multiplayer')
	},
	beforeMount(){
		console.log("hoi");
		onBeforeMount(async () => {
			try {
				const player1ID = 1;
				const username = await fetchUsername(player1ID);
				console.log(username);
			} catch (error) {
				console.log("Error fetiching username");
			}
		});
		const fetchUsername = async (player_id: number) => {
		const response = await axiosInstance.get('player/username/' + player_id.toString());
		return response.data;
	}
}
},
mounted() {
	// console.log(this.pong)
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}
	const player1_id = 1;
	// socket.emit('joinMatchmaking', player1_id);
	// socket.emit('joinMatchmaking', 2);
	socket.on('startMatch', (match) => {
			this.dynamicText1 = 'username1';
			this.dynamicText1 = 'username2';
			console.log('Match found!')
			// this.startMatch()
		}
		)
		// window.addEventListener('keyup', this.keyUp);
		// window.addEventListener('keydown', this.keyDown);
		// setInterval(this.movePaddle, 1);
		// socket.emit('movement', this.move);
	}
})

</script>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Adjust the height as needed */
}

.text-wrapper{
	position: absolute;
	display: flex;
	align-items: center;
	margin-left: 50%;
	margin-top: 80px;
	transform: translate(-50%, -50%);
}
.text {
	margin: 0 50px;
	text-align: center;
}
/* .player1_text {
	text-align: center;
	margin-right: 30%;
}
.player2_text {
	text-align: center;
	margin-left: 30%;
} */
</style> -->