<template>
    <div class="users-container">
        <h4>Direct Messages</h4>
        <ul id="userList">
            <li v-for="(playerName, index) in onlinePlayers" :key="index">
                {{ playerName === currentPlayer ? playerName + ' (You)' : playerName }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref} from 'vue'

const onlinePlayers = ref([]);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const currentPlayer = sessionStorage.getItem('username');

onBeforeMount(async () => {

    // FIND ALL ONLINE Players
    const fetchOnlinePlayers = async () => {
        const response = await axiosInstance.get('player/online');
        onlinePlayers.value = response.data.map(item => item.player.username);
    }

    await fetchOnlinePlayers();

    //UPDATE LIST OF ONLINE PLAYERS IF NEW PLAYER IS ADDED
    // socket.on('player', (player_id: number) => {
    //     const newPlayerName = await fetchUsername(player_id);
    //     onlinePlayers.value.push();
    // });

})


</script>