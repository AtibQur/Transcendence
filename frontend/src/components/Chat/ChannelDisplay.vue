<template>
    <h4>Available Channels</h4>
    <h3> hello  {{ props.playerId }}</h3>
    <ul id="channelList">
        <button v-for="(channel, index) in channels" :key="index" @click="changeChannel(channel.channel_id)">
            {{ getChannelName(channel.channel_id) }}
        </button>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref, computed } from 'vue'

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['changeChannel']);

const channels = ref({});
const channelNames = ref<Record<number, string>>({}); // Hold the sender names

onBeforeMount(async () => {

    console.log('hello', props.playerId);
    // FIND ALL CHANNEL FOR PLAYER
    await socket.emit('findPlayerChannels', props.playerId, (response) => {
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