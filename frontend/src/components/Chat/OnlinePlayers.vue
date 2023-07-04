<template>
    <div class="users-container">
        <h4>Online Players</h4>
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
import { onBeforeMount, ref, computed } from 'vue'

const onlinePlayers = ref([]);
const currentPlayer = sessionStorage.getItem('username');

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    }
});

onBeforeMount(async () => {

    // FIND ALL CHANNEL FOR PLAYER
    socket.emit('findAllOnlinePlayers', (response) => {
        response.forEach(user => {
            onlinePlayers.value.push(user.player.username);
        });
    });

    //UPDATE LIST OF ONLINE PLAYERS IF NEW PLAYER IS ADDED
    // socket.on('player', (player_id: number) => {
    //     const newPlayerName = await fetchUsername(player_id);
    //     onlinePlayers.value.push();
    // });

})

// EVENT TO CHANGE CURRENT CHANNEL
// const changeChannel = (channel_id: number) => {
//     emit('changeChannel', channel_id);
// }

// const fetchChannelName = async (channel_id: number) => {

//     return new Promise<string>((resolve) => {
//         socket.emit('findOneChannelName', channel_id, (channel_name: string) => {
//             resolve(channel_name);
//         });
//     });
// };

// const updateChannelName = async (channel_id: number) => {
//     const channel_name = await fetchChannelName(channel_id);
//     channelNames.value[channel_id] = channel_name;
// };

// const getChannelName = (channel_id: number) => {
//     if (channelNames.value[channel_id]) {
//         return channelNames.value[channel_id];
//     }
    
//     updateChannelName(channel_id);
//     return computed(() => channelNames.value[channel_id]);
// };

</script>