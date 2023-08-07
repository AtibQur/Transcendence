<template>
  <div>
      <div class="channel-name-container">
          <button class="channel-name-button" @click="showInfo()"> 
              <b>{{ channelName }}</b>
          </button>
      </div>
      <div class="messages-container" ref="messagesContainerRef">
          <div class="messages-list" ref="messageslistRef">
            <div v-for="message in messages" :key="message.id" :class="getMessageSenderClass(message)">
              <div class="myMessagePosition" :style="getMessageBlockSize(message)">
                {{ message.sender.username === username ? 'You' : message.sender.username }}
                <div :class="getMessageClass(message)">
                  {{ message.content }}
                </div>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { socket } from '@/socket';
  import axiosInstance from '../../axiosConfig';
  import { onMounted, onBeforeMount, ref, watch, nextTick } from 'vue';
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
  const messageslistRef = ref<HTMLElement | null>(null);
  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
  const username = sessionStorage.getItem('username') || '0';
  
  onMounted(() => {
    scrollToBottom();
  });

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

const getMessageBlockSize = (message: Message) => {
    const senderName = message.sender.username === username ? 'You' : message.sender.username;
    const totalWidth = senderName.length * 10 + message.content.length * 10 + 20;
    return {
      width: `${totalWidth}px`,
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
  const container = messageslistRef.value;
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

.channel-name-container {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white; /* Ensure the background color covers the button */
}

.messages-container {
    display: flex;
    flex-direction: column;
    max-height: calc(110vh); /* Adjust as needed based on your layout */
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 16px; /* Adjust this value to match the width of the browser's default scrollbar */
}

.messages-list {
    flex: none; /* Fixed height */
    max-height: calc(71vh); /* Adjust the height as needed */
    overflow-y: auto;
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
    position: sticky;
    top: 0;
    z-index: 1;
}

.my-message-sender {
    color: var(--gray-medium);
    align-self: flex-end;
    text-align: right;
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
    border-radius: 10px;
    padding: 8px 12px;
    margin: 15px;
    margin-top: 5px;
    align-self: flex-end; /* Align to the right side */
}

.friend-message {
    background-color: rgba(125, 46, 222, 0.2);
    color: rgba(87, 11, 179, 1);
    border-radius: 10px;
    padding: 8px 12px;
    margin: 15px;
    margin-top: 5px;
}

.myMessagePosition {
    align-self: flex-end;
}

</style>