<template>
    <h4>Available Channels</h4>
    <ul id="channelList">
        <li v-for="(channel, index) in channels" :key="index">
            <button class="channel-display-button" @click="changeChannel(channel.channel_id)"> {{ channel.channel.name }} </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref} from 'vue'

const emit = defineEmits(['changeChannel']);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const channels = ref([]);

onBeforeMount(async () => {
    
    await fetchChannels(playerId);
    
    // LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newChannel', (channel) => {
        socket.emit('joinRoom', { playerId: playerId, channelId: channel.channel_id }, () => {
            channels.value.push(channel);
        })
    });
    
    // UPDATE CHANNEL DISPLAY IF PLAYER LEAVE A CHANNEL
    socket.on('leftChannel', (channelName: string) => {
        const index = channels.value.findIndex((item) => item.channel.name === channelName);

        if (index == -1)
            console.log(`channel not found in channels`);
        else 
            channels.value.splice(index, 1);
    });
})
    
    // FIND ALL CHANNEL FOR PLAYER
    const fetchChannels = async (playerId: number) => {
        const response = await axiosInstance.get('channelmember/allchannels/' + playerId.toString());
        channels.value = response.data;
    }

    // EVENT TO CHANGE CURRENT CHANNEL
    const changeChannel = (channel_id: number) => {
        emit('changeChannel', channel_id, true);
    }

</script>

<style>
.channel-display-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: rgb(79, 76, 76);
    text-decoration: underline;
    transition: color 0.3s;
    padding: 0;
    margin: 0;
}

</style>