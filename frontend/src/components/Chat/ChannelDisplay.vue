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

// const props = defineProps({
//     playerId: {
//         type: Number,
//         required: true
//     }
// });

const emit = defineEmits(['changeChannel']);

const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const channels = ref([]);

onBeforeMount(async () => {

    // FIND ALL CHANNEL FOR PLAYER
    const fetchChannels = async (playerId: number) => {
        const response = await axiosInstance.get('channelmember/allchannels/' + playerId.toString());
        channels.value = response.data;
    }

    await fetchChannels(playerId);

    // LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newChannel', (channel) => {
        channels.value.push(channel);
    });

    // socket.on('leftChannel', (channel_id) => {

    // });

})

// EVENT TO CHANGE CURRENT CHANNEL
const changeChannel = (channel_id: number) => {
    emit('changeChannel', channel_id);
}

// //FETCH NAME FROM DATABASE
// const fetchChannelName = async (channel_id: number) => {

//     return new Promise<string>((resolve) => {
//         socket.emit('findOneChannelName', channel_id, (channel_name: string) => {
//             resolve(channel_name);
//         });
//     });
// };

// //UPDATE LIST OF CHANNELS
// const updateChannelName = async (channel_id: number) => {
//     const channel_name = await fetchChannelName(channel_id);
//     channelNames.value[channel_id] = channel_name;
// };

// //GET NAME OF CHANNEL BY ID
// const getChannelName = (channel_id: number) => {
//     if (channelNames.value[channel_id]) {
//         return channelNames.value[channel_id];
//     }
//     updateChannelName(channel_id);
//     return computed(() => channelNames.value[channel_id]);
// };

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