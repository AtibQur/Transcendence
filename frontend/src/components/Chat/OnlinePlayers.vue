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
import { onBeforeMount, ref, computed } from 'vue'

const onlinePlayers = ref([]);
const currentPlayer = ref('');

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    }
});

/* 
    1. at the start all channels of a player are displayed. -> findPlayerChannels()
        - with the player id, an object is returned with the channel_id,
        - for each channel_id, the name needs to be found -> findOneChannelName()
    2. component is also listening whether there is a new channel added for the current player -> addChannel()
    3. component is also listening whether the player leaves a channels -> leaveChannel()
*/

onBeforeMount(() => {
    socket.emit('findUsername'), props.playerId, (name: string) => {
        console.log(name);
        // currentPlayer.value = name;
    }

    // FIND ALL CHANNEL FOR PLAYER
    socket.emit('findAllOnlinePlayers', (response) => {
        response.forEach(user => {
            onlinePlayers.value.push(user.player.username);
        });
    });

    //UPDATE LIST OF CHANNELS IF NEW CHANNEL IS ADDED
    // socket.on('player', (payload: {channel_id: number}) => {
    //     channels.value.push({ channel_id: payload.channel_id });
    // });

    // socket.on('leftChannel', (channel_id) => {

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