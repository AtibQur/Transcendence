<template>
    <div class="channel-container">
        <h4>Available Channels</h4>
        <ul id="channelList">
            <!-- <button v-for="(channel, index) in channels" :key="index" @click="changeChannel(channel.name)">
                {{ channel.name }}
            </button> -->
        </ul>
    </div>
</template>

<script setup lang="ts">
import { socket } from '@/socket';
import { onBeforeMount, ref } from 'vue'

interface Channel {
    name: string,
    password?: string,
    is_private: boolean,
    owner_id: number
}

const props = defineProps({ id: Number });
// const channels = ref<Channel>({});
console.log(props.id);

onBeforeMount(() => {
    socket.emit('findAllChannels', props.id, (response) => {
        console.log(response);
    })
})
</script>