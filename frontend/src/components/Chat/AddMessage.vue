<template>
    <div class="new-message">
        <form @submit.prevent="sendMessage">
            <input v-model="content" placeholder='Write a message' class="message-input" :maxlength="100"/>
            <button class="simple-button" type="submit">Send</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { socket } from '@/utils/socket';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const toast = useToast();
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const content = ref('');

const sendMessage = () => {
    const trimmedContent = content.value.trim();
    if (trimmedContent !== '' && trimmedContent.length <= 100) {
        socket.emit('addChatmessage', { content: trimmedContent, sender_id: playerId, channel_id: props.channelId }, (response) => {
            if (response == false)
                toast.add({ severity: 'error', summary: 'You are not allowed to send this message', detail: '', life: 3000 });
            else
                content.value = '';
        })
    } else if (trimmedContent.length > 100) {
        toast.add({ severity: 'warn', summary: 'Message is too long. Max 100 characters allowed.', detail: '', life: 3000 });
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
    color: var(--blue-mediumlight);
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