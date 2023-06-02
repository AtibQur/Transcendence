<template>
    <h2> Chat: {{ channelName }} </h2>
    <div>
        <div v-for="message in messages" :key="message.id">
            {{ getSenderName(message.sender_id) }}: {{ message.content }}
        </div>
    </div>
  </template>

<script setup lang="ts">
import { socket } from '@/socket';
import { onBeforeMount, ref, computed, watchEffect} from 'vue'

interface Message {
    id: number
    content: string;
    sender_id: number;
    channel_id: number;
}

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelName = ref('');
const messages = ref<Message[]>([]);
const senderNames = ref<Record<number, string>>({}); // Hold the sender names

onBeforeMount(async () => {
    // FIND CHANNEL MESSAGES
    const response = await new Promise<Message[]>((resolve) => {
        socket.emit('findAllChannelMessages', props.channelId, (response: Message[]) => {
        resolve(response);
        });
    });
    messages.value = response;

    //FIND CHANNEL NAME
    socket.emit('findOneChannelName', props.channelId, (name: string) => {
        channelName.value = name;
    });

    //ADD MESSAGE TO CURRENT MESSAGES
    socket.on('chatmessage', (message) => {
        messages.value.push(message);
    });

});

const fetchSenderName = async (sender_id: number) => {
    return new Promise<string>((resolve) => {
        socket.emit('findUsername', sender_id, (sender_name: string) => {
            resolve(sender_name);
        });
    });
};

const updateSenderName = async (sender_id: number) => {
    const sender_name = await fetchSenderName(sender_id);
    senderNames.value[sender_id] = sender_name;
};

const getSenderName = (sender_id: number) => {
    if (senderNames.value[sender_id]) {
        return senderNames.value[sender_id];
    }
    
    updateSenderName(sender_id);

    return computed(() => senderNames.value[sender_id]);
};
</script>


<style>

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}


</style>