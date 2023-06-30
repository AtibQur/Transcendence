<template>
    <h4>Channel Members</h4>
    <ul id="channelmemberList">
        <li v-for="(channelmember, index) in channelmembers" :key="index">
            {{ channelmember }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref, watch } from 'vue'

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelmembers = ref([]);
const currentChannelId = ref(props.channelId);

onBeforeMount(async () => {

    // FIND ALL CHANNEL FOR PLAYER
    const fetchChannelmembers = async (channelId) => {
        socket.emit('findAllChannelmembersNames', channelId, (response) => {
            channelmembers.value = response;
        });
    }

    await fetchChannelmembers(currentChannelId.value);

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChannelmembers(currentChannelId.value);
    });
})


</script>

<style>

</style>