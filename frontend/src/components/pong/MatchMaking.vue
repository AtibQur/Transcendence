<template>
	<h1>Finding players...</h1>
	<div class="container">
		<div class="text-wrapper">
			<h1 class="text">{{ dynamicText1 }}</h1>
			<h1 class="text">VS</h1>
			<h1 class="text">{{ dynamicText2 }}</h1>
		</div>
	</div>
</template>

<script lang="ts">
	export let p1 = ''
	export let p2 = ''

	import { onBeforeMount, ref } from 'vue'
	import { useRouter } from 'vue-router'
	import { socket } from '../../socket'
	import axiosInstance from '../../axiosConfig'

export default {
	name: 'MatchMaking',
	setup() {
		const dynamicText1 = ref('P1');
		const dynamicText2 = ref('P2');
		const beginMatch = ref(false);
		const router = useRouter();
		const player = {
			id: 0,
			socket_id: '',
		};

	onBeforeMount(async () => {
		player.id = 9;
		player.socket_id = socket.id;
		socket.emit('joinMatchmaking', {player_id: player.id, socket_id: player.socket_id});
		// const username = await fetchUsername(9);
		// dynamicText1.value = username;
		// socket.emit('joinMatchmaking', 2);
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
		// console.log(socket.id)
		// console.log(player)
		p1 = match.p1;
		p2 = match.p2;
		console.log(match.p1, 'and', match.p2, 'are in a match');

		// const username = await fetchUsername(match.player1_id);
		// const opponent = await fetchUsername(match.player2_id);
		// dynamicText2.value = opponent;
			router.push('/play/multiplayer');
	} catch (error) {
		console.log('Error starting match')
	}
	});
	return {
		dynamicText1,
		dynamicText2,
		beginMatch,
		};
	},
};
</script>
  
<style>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
  }

.text-wrapper {
	position: absolute;
	display: flex;
	align-items: center;
	/* margin-left: 40%; */
	/* transform: translate(-50%, -50%); */
}

.text {
	margin: 0 50px;
	text-align: center;
}
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