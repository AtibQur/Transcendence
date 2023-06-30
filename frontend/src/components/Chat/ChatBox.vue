<template>
    <h2> Chat: {{ channelName }} </h2>
    <div>
        <div v-for="message in messages" :key="message.id">
                <!-- <h6> {{ getDateMsg(message.sent_at) }}</h6> -->
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
// const newDate = ref(true);
const dates = ref<string>([]);

onBeforeMount(async () => {
    
    // FIND CHANNEL MESSAGES FILTERED
    const fetchChatMessagesFiltered = async (player_id: number, channel_id: number) => {
        const channel_id_query = 'channel_id=' + channel_id.toString();
        const response = await axiosInstance.get('chatmessage/filtered/' + player_id.toString() + `?${channel_id_query}`);
        messages.value = response.data;
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
        console.log("new message");
        addChatmessage(message);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChatMessagesFiltered(props.playerId, currentChannelId.value);
        await fetchChannelName(currentChannelId.value);
    });

});

// const createDateMsg = (dateStr: string) => {
//     const date = new Date(dateStr)

//     const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const weekdayName = weekdays[date.getDay()];

//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();

//     return `${weekdayName} ${day}/${month}/${year}`;
// }

// const getDateMsg = (dateStr: string) => {
//     const date = createDateMsg(dateStr);
//     console.log(dates.value.includes(date));
//     if (dates.value.includes(date))
//         console.log('hi');// return '';
//     else
//         dates.value.push(date);
//     console.log(date);
//     return date;
// }

// const getTimeMsg = async (message_id: number) => {
//     const response = await axiosInstance.get('chatmessage/time/' + message_id.toString());
//     console.log(response.data);
//     return response.data;
// }

async function addChatmessage(message: Message) {
    try {
        const username_query = 'username=' + message.sender.username;
        const player_id = sessionStorage.getItem('playerId');
        console.log(player_id);
        const isBlocked = await axiosInstance.get('blockedplayer/player/' + player_id + `?${username_query}`);
        // if (!isBlocked)
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