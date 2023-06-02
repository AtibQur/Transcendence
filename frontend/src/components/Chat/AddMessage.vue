<template>
    <div class="message-input">
        <form @submit.prevent="sendMessage">
            <input v-model="content" placeholder='Write a message'/>
            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref } from 'vue';

interface Message {
    content: string;
    sender_id: number;
    channel_id: number;
}

const props = defineProps({
    senderId: {
        type: Number,
        required: true
    },
    channelId: {
        type: Number,
        required: true
    }
});

const content = ref('');


// onBeforeMount(() => {

// })

const sendMessage = () => {
    console.log(props.senderId);
    socket.emit('addChatmessage', { content: content.value, sender_id: props.senderId, channel_id: props.channelId }, () => {
        content.value = '';
    })
}

</script>

<style>
</style>