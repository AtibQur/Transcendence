<template>
    <h2> Chat: {{ channelName }} </h2>
    <div>
        <div v-for="message in messages" :key="message.id">
            {{ message.sender.username }}: {{ message.content }}
        </div>
    </div>
  </template>

<script setup lang="ts">
import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, onUpdated, ref, computed, watch} from 'vue'
import Message from '@/types/Message';

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    },
    channelId: {
        type: Number,
        required: true
    }
});

const channelName = ref('');
const messages = ref<Message[]>([]);
const currentChannelId = ref(props.channelId);

onBeforeMount(async () => {
    
    // FIND CHANNEL MESSAGES FILTERED
    const fetchChatMessagesFiltered = async (player_id: number, channel_id: number) => {
        const channel_id_query = 'channel_id=' + channel_id.toString();
        const response = await axiosInstance.get('chatmessage/filtered/' + player_id.toString() + `?${channel_id_query}`);
        messages.value = response.data;
        console.log(response.data);
        // return response.data;
    };

    //FIND CHANNEL NAME
    const fetchChannelName = async (channelId: number) => {
        socket.emit('findOneChannelName', channelId, (name: string) => {
            try {
                channelName.value = name;
            } catch (e) {
                console.log('Error: fetching channel name');
            }
        });
    };

    await fetchChatMessagesFiltered(props.playerId, currentChannelId.value);
    await fetchChannelName(currentChannelId.value);


    //ADD MESSAGE TO CURRENT MESSAGES
    socket.on('chatmessage', (message: Message) => {
        addChatmessage(message);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChatMessagesFiltered(props.playerId, currentChannelId.value);
        await fetchChannelName(currentChannelId.value);
    });

});

async function addChatmessage(message: Message) {
    try {
        messages.value.push(message);
    } catch (error) {
        console.log('Error: adding message');
    }
}

</script>


<style>

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}


</style>