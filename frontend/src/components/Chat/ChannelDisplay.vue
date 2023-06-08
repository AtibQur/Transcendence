<template>
    <div class="channel-container">
        <h4>Available Channels</h4>
        <ul id="channelList">
            <button v-for="(channel, index) in channels" :key="index" @click="changeChannel(channel.channel_id)">
                {{ getChannelName(channel.channel_id) }}
            </button>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref, computed } from 'vue'
import AddChannel from './AddChannel.vue';

interface Channel {
    name: string,
    password?: string,
    is_private: boolean,
    owner_id: number
}

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['changeChannel']);

const channels = ref({});
const channelNames = ref<Record<number, string>>({}); // Hold the sender names

/* 
    1. at the start all channels of a player are displayed. -> findPlayerChannels()
        - with the player id, an object is returned with the channel_id,
        - for each channel_id, the name needs to be found -> findOneChannelName()
    2. component is also listening whether there is a new channel added for the current player -> addChannel()
    3. component is also listening whether the player leaves a channels -> leaveChannel()
*/

onBeforeMount(() => {

    // FIND ALL CHANNEL FOR PLAYER
    socket.emit('findPlayerChannels', props.playerId, (response) => {
        channels.value = response;
    });

    //LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newChannel', (payload: {channel_id: number}) => {
        addChannel(payload.channel_id);
    });

    // socket.on('leftChannel', (channel_id) => {

    // });

})

async function addChannel(channelId: number) {
    try {
        const isMember = await checkMembership(props.playerId, channelId);
        if (isMember) {
            console.log(`player ${props.playerId} is member of ${channelId}`)
            channels.value.push({channel_id: channelId});
        }
    } catch (error) {
        console.log('Error: adding channel');
    }
}

async function checkMembership(playerId: number, channelId: number) {
    return new Promise<boolean>((resolve) => {
        socket.emit('checkMembership', {playerId, channelId}, (result: boolean) => {
            resolve(result);
        })
    })
}

// EVENT TO CHANGE CURRENT CHANNEL
const changeChannel = (channel_id: number) => {
    emit('changeChannel', channel_id);
}

//FETCH NAME FROM DATABASE
const fetchChannelName = async (channel_id: number) => {

    return new Promise<string>((resolve) => {
        socket.emit('findOneChannelName', channel_id, (channel_name: string) => {
            resolve(channel_name);
        });
    });
};

//UPDATE LIST OF CHANNELS
const updateChannelName = async (channel_id: number) => {
    const channel_name = await fetchChannelName(channel_id);
    channelNames.value[channel_id] = channel_name;
};

//GET NAME OF CHANNEL BY ID
const getChannelName = (channel_id: number) => {
    if (channelNames.value[channel_id]) {
        return channelNames.value[channel_id];
    }
    updateChannelName(channel_id);
    return computed(() => channelNames.value[channel_id]);
};

</script>