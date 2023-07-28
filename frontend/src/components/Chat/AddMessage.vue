<template>
    <div class="new-message">
        <form @submit.prevent="sendMessage">
            <input v-model="content" placeholder='Write a message' class="message-input"/>
            <button class="simple-button" type="submit">Send</button>
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
    const trimmedContent = content.value.trim();
    if (trimmedContent !== '') {
        socket.emit('addChatmessage', { content: content.value, sender_id: playerId, channel_id: props.channelId }, () => {
            content.value = '';
        })
    }
}

</script>

<style scoped>
.simple-button {
    font-family: 'JetBrains mono';
    border: none;
    border-radius: 20%;
    cursor: pointer;
    padding: 7px;
}

.simple-button:hover {
    color: var(--blue-medium);
}

.message-input {
    font-family: 'JetBrains mono';
    background-color: var(--gray-light);
    border-radius:10px;
    border: none;
    width: 90%;
    padding: 10px;
    margin: 10px;
}
</style>