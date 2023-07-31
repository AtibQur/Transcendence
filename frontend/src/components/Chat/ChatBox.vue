<template>
    <div>
      <button class="channel-name-button" @click="showInfo()"> 
        <b>{{ channelName }}</b>
      </button>
      <div class="messages-container">
        <div v-for="message in messages" :key="message.id" :class="getMessageSenderClass(message)">
          {{ message.sender.username }}
          <div :class="getMessageClass(message)">
            {{ message.content }}
        </div>
          </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, onUpdated, ref, computed, watch} from 'vue'
import Message from '@/types/Message';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['showInfo']);
const channelName = ref('');
const messages = ref<Message[]>([]);
const currentChannelId = ref(props.channelId);
// const newDate = ref(true);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const username = sessionStorage.getItem('username') || '0';
// const dates = ref<string>([]);

onBeforeMount(async () => {
    await fetchChatMessagesFiltered(playerId, currentChannelId.value);
    await fetchChannelName(currentChannelId.value);

    
    //ADD MESSAGE TO CURRENT MESSAGES
    socket.on('chatmessage', (message: Message) => {
        console.log("new message");
        addChatmessage(message);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChatMessagesFiltered(playerId, currentChannelId.value);
        await fetchChannelName(currentChannelId.value);
    });
    
});

// FIND CHANNEL MESSAGES FILTERED
const fetchChatMessagesFiltered = async (player_id: number, channel_id: number) => {
    const channel_id_query = 'channel_id=' + channel_id.toString();
    const response = await axiosInstance.get('chatmessage/filtered/' + player_id.toString() + `?${channel_id_query}`);
    messages.value = response.data;
};

//FIND CHANNEL NAME
const fetchChannelName = async (channelId: number) => {
    const response = await axiosInstance.get('channel/' + channelId.toString());
    if (response.data)
    {
        if (!response.data.is_dm)
            channelName.value = response.data.name;
        else { //if the channel is a dm then channelname become the name of the friend
            const members = await axiosInstance.get('channelmember/allmembers/' + channelId.toString());
            if (members.data)
            {
                const friend = members.data.find((member) => member.member_id !== playerId);
                if (friend)
                    channelName.value = friend.member.username;
            }
        }
    }
    else
        console.log('Error fetching channelname');
};

const getMessageClass = (message: Message) => {
  return message.sender.username === username ? 'my-message' : 'friend-message';
};

const getMessageSenderClass = (message: Message) => {
  return message.sender.username === username ? 'my-message-sender' : 'friend-message-sender';
};

const getMessageBlockSize = (messageContent: string) => {
  return {
    width: `${messageContent.length * 10}px`, // Adjust the multiplier to control the width
  };
};

const showInfo = () => {
    emit('showInfo', true);
}

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

.channel-name-button {
    font-family: 'JetBrains Mono';
    font-weight: bold;
    border: none;
    cursor: pointer;
    background-color: var(--gray-light);
    color: var(--black-soft);
    font-size: large;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 75px;
    margin-bottom: 20px;
}
.channel-name-button:hover {
    background-color: var(--gray-shadow);
    color: var(--white-softgray);
    transition: 0.3s;
}

.messages-container {
    display: flex;
    flex-direction: column;
  }

.my-message-sender {
    color: var(--gray-medium);
    align-self: flex-end;
    text-align: right;
    margin-right: 10px;
}

.friend-message-sender {
    color: var(--gray-medium);
    align-self: flex-start;
    text-align: left;
    margin-left: 15px;
}

.my-message {
    background-color: rgba(230, 99, 230, 0.2);
    color: rgba(179, 11, 179, 1);
    border-radius:10px;
    padding: 8px 12px;
    margin: 15px;
    margin-top: 5px;
    align-self: flex-end;
}

.friend-message {
    background-color: rgba(125, 46, 222, 0.2);
    color: rgba(87, 11, 179, 1);
    border-radius:10px;
    padding: 8px 12px;
    margin: 15px;
    margin-top: 5px;
    align-self: flex-end;
}

</style>