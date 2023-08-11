<template>
    <h4>Channels</h4>
    <div class="channel-container">
        <div v-if="text" class="txtmsg">
            <small>{{ text }}</small>
        </div>
        <ul id="channelList" class="channel-list">
            <li v-for="(channel, index) in channels" :key="index">
                <button class="channel-display-button" @click="changeChannel(channel.channel_id)"> {{ channel.channel.name }} </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../utils/socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref} from 'vue'

const emit = defineEmits(['changeChannel']);
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const channels = ref([]);
const text = ref('');

onBeforeMount(async () => {
    
    await fetchChannels(playerId);
    
    // LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newChannel', (channel) => {
        socket.emit('joinRoom', { playerId: playerId, channelId: channel.channel_id }, () => {
            channels.value.push(channel);
            text.value = '';
        })
    });
    
    // UPDATE CHANNEL DISPLAY IF PLAYER LEAVE A CHANNEL
    socket.on('leftChannel', (channelName: string) => {
        const index = channels.value.findIndex((item) => item.channel.name === channelName);
        if (index == -1)
            console.log(`channel not found in channels`);
        else {
            channels.value.splice(index, 1);
            emit('changeChannel', 0, false, false)
            if (channels.value.length == 0)
                text.value = 'No Channels yet';
        }
    });
})
    
    // FIND ALL CHANNEL FOR PLAYER
    const fetchChannels = async (playerId: number) => {
        const response = await axiosInstance.get('channelmember/allchannels/' + playerId.toString());
        if (response.data.length == 0)
            text.value = 'No Channels yet';
        channels.value = response.data;
    }

    // EVENT TO CHANGE CURRENT CHANNEL
    const changeChannel = (channel_id: number) => {
        emit('changeChannel', channel_id, true, false);
    }

</script>

<style>
    .channel-container {
        height: 275px;
        background-color: var(--white-moretransparent);
    }

    .channel-list {
        max-height: 275px;
        overflow-y: auto;
    }

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

    .txtmsg {
        color: var(--gray-dark);
        padding: 30px;
    }

</style>