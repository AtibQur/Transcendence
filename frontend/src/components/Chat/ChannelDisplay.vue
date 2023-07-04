<template>
    <h4>Available Channels</h4>
    <h3> hello  {{ props.playerId }}</h3>
    <ul id="channelList">
        <li v-for="(channel, index) in channels" :key="index">
            <button class="channel-display-button" @click="changeChannel(channel.channel_id)"> {{ getChannelName(channel.channel_id) }} </button>
        </li>
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

    // FIND ALL CHANNEL FOR PLAYER
    await socket.emit('findPlayerChannels', props.playerId, (response) => {
        channels.value = response;
    });

    // LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newChannel', (channelId: number) => {
        console.log('new channel');
        socket.emit('joinRoom', { player_id: props.playerId, channel_id: channelId}, () => {
            console.log('joined channel');
            channels.value.push({channel_id: channelId})
        })
    });

    // socket.on('leftChannel', (channel_id) => {

    // });

})

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

<style>
.channel-display-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #000;
  text-decoration: underline;
  transition: color 0.3s;
  padding: 0;
  margin: 0;
}

.channel-display-button {
  color: rgb(79, 76, 76);
}
</style>