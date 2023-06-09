<template>
    <h4>Channel Members</h4>
    <ul id="channelmemberList">
        <!-- <button v-for="(channelmember, index) in channelmembers" :key="index" @click="changeChannel(channel.channel_id)">
            {{ getChannelName(channel.channel_id) }}
        </button> -->
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref, computed } from 'vue'

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelmembers = ref({});

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

</script>

<style>

</style>