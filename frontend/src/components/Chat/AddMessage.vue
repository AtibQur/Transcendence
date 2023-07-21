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
// import Message from '@/types/Message';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const content = ref('');


// onBeforeMount(() => {

// })

const sendMessage = () => {
    socket.emit('addChatmessage', { content: content.value, sender_id: playerId, channel_id: props.channelId }, () => {
        content.value = '';
    })
}

</script>

<style>
</style>