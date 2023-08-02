<template>
    <div>
      <button class="channel-name-button" @click="showInfo()"> 
        <b>{{ channelName }}</b>
      </button>
      <div class="messages-container" ref="messagesContainerRef">
        <div v-for="message in messages" :key="message.id" :class="getMessageSenderClass(message)">
          {{ message.sender.username === username ? 'You' : message.sender.username }}
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
  import { onBeforeMount, ref, watch, nextTick } from 'vue'
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
  const messagesContainerRef = ref<HTMLElement | null>(null);
  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
  const username = sessionStorage.getItem('username') || '0';
  
  onBeforeMount(async () => {
    await fetchChatMessagesFiltered(playerId, currentChannelId.value);
    await fetchChannelName(currentChannelId.value);
  
    socket.on('chatmessage', (message: Message) => {
      console.log("new message");
      addChatmessage(message);
    });
  
    watch(() => props.channelId, async (newChannelId) => {
      currentChannelId.value = newChannelId;
      await fetchChatMessagesFiltered(playerId, currentChannelId.value);
      await fetchChannelName(currentChannelId.value);
    });
  });
  
  const fetchChatMessagesFiltered = async (player_id: number, channel_id: number) => {
    const channel_id_query = 'channel_id=' + channel_id.toString();
    const response = await axiosInstance.get('chatmessage/filtered/' + player_id.toString() + `?${channel_id_query}`);
    messages.value = response.data;
  };
  
  const fetchChannelName = async (channelId: number) => {
    const response = await axiosInstance.get('channel/' + channelId.toString());
    if (response.data) {
      if (!response.data.is_dm)
        channelName.value = response.data.name;
      else {
        const members = await axiosInstance.get('channelmember/allmembers/' + channelId.toString());
        if (members.data) {
          const friend = members.data.find((member) => member.member_id !== playerId);
          if (friend)
            channelName.value = friend.member.username;
        }
      }
    } else
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

async function addChatmessage(message: Message) {
  try {
    const username_query = 'username=' + message.sender.username;
    const player_id = sessionStorage.getItem('playerId');
    const isBlocked = await axiosInstance.get('blockedplayer/player/' + player_id + `?${username_query}`);
    messages.value.push(message);
    nextTick(scrollToBottom); // Scroll to bottom when a new message is added
  } catch (error) {
    console.log('Error: adding message');
  }
}

// Scroll to the bottom of the messages container
function scrollToBottom() {
  const container = messagesContainerRef.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// Watch for changes in the messages array and scroll to the bottom when needed
watch(messages, () => {
  nextTick(scrollToBottom);
}, { immediate: true });

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
    max-height: 70vh; /* Adjust the maximum height relative to viewport height */
    overflow-y: auto;
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