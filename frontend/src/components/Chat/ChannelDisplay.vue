<template>
    <h4>Channels</h4>
    <div class="channel-list-container">
        <ul id="channelList">
            <li v-for="(channel, index) in channels" :key="index">
                <button class="channel-display-button" @click="changeChannel(channel.channel_id)"> {{ channel.channel.name }} </button>
            </li>
        </ul>
    </div>
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
        console.log('all channels: ', channels.value);
        console.log('name: ', channelName);
        if (index == -1)
            console.log(`channel not found in channels`);
        else {
            channels.value.splice(index, 1);
            emit('changeChannel', 0, false, false)
        }
    });
})
    
    // FIND ALL CHANNEL FOR PLAYER
    const fetchChannels = async (playerId: number) => {
        const response = await axiosInstance.get('channelmember/allchannels/' + playerId.toString());
        channels.value = response.data;
    }

    // EVENT TO CHANGE CURRENT CHANNEL
    const changeChannel = (channel_id: number) => {
        emit('changeChannel', channel_id, true, false);
    }

</script>

<style>
    .channel-display-button {
        font-family: 'JetBrains Mono';
        border: none;
        cursor: pointer;
        background-color: var(--white-moretransparent);
        color: var(--black-soft);
        min-height:30px; 
        width: 100%;
        text-align: left;
        transition: color 0.3s;
        padding: 20px;
        margin: 0;
    }

    .channel-display-button:hover {
        background-color: var(--blue-dark-transparent);
        color: var(--white-softblue);
        transition: 0.3s;
    }
    .channel-list-container {
    max-height: 275px; /* Adjust the max height as needed */
    overflow-y: auto;
}
</style>