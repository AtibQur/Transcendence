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
const senderNames = ref<Record<number, string>>({}); // Hold the sender names
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
        const isMember = await checkMembership(props.playerId, message.channel_id);
        if (isMember) {
            messages.value.push(message);
        }
    } catch (error) {
        console.log('Error: adding message');
    }
}

//maybe make a composable of this?! used in multiple files
async function checkMembership(playerId: number, channelId: number) {
    return new Promise<boolean>((resolve) => {
        socket.emit('checkMembership', {playerId, channelId}, (result: boolean) => {
            resolve(result);
        })
    })
}

//FETCH NAME FROM DATABASE
const fetchSenderName = async (sender_id: number) => {
    return new Promise<string>((resolve) => {
        socket.emit('findUsername', sender_id, (sender_name: string) => {
            resolve(sender_name);
        });
    });
};

//UPDATE LIST OF SENDERS
const updateSenderName = async (sender_id: number) => {
    const sender_name = await fetchSenderName(sender_id);
    senderNames.value[sender_id] = sender_name;
};

//GET NAME OF SENDER BY ID
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