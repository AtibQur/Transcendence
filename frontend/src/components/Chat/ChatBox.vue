<template>
  <div>
      <button class="channel-name-button" @click="showInfo()">
          <b>{{ channelName }}</b>
          <i class="pi pi-info-circle"></i>
      </button>
      <div class="messages-container" ref="messagesContainer" @load="scrollToBottom" @after-leave="scrollToBottom">
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
import { onMounted, onBeforeMount, ref, watch, nextTick, onUpdated} from 'vue'
import Message from '@/types/Message';
import {useToast} from 'primevue/usetoast';

const props = defineProps({
  channelId: {
      type: Number,
      required: true
    }
  });
  
  const toast = useToast();
  const emit = defineEmits(['showInfo']);
  const channelName = ref('');
  const messages = ref<Message[]>([]);
  const currentChannelId = ref(props.channelId);
  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
  const username = sessionStorage.getItem('username') || null;
  const messagesContainer = ref<HTMLElement | null>(null);
  
  onMounted(() => {
  // Scroll to the bottom of the messages container when the component is mounted
    scrollToBottom();
  });

  onBeforeMount(async () => {
    await fetchChatMessagesFiltered(playerId, currentChannelId.value);
    await fetchChannelName(currentChannelId.value);
    
    //ADD MESSAGE TO CURRENT MESSAGES
    socket.on('chatmessage', async (message: Message) => {
      await axiosInstance.get(`blockedplayer/player/${playerId.toString()}?username=${message.sender.username}`)
        .then((response) => {
          if (response.data == false)
          {
            if (message.channel_id == currentChannelId.value) {
              messages.value.push(message);
            }
            if (message.sender.username != username) {
              toast.add({ severity: 'success', summary: 'New message from ' + message.sender.username , detail: 'test', life: 3000 });
            }
          }
        });

      // Use nextTick to ensure that the DOM is updated before scrolling
      nextTick(() => {
        // Scroll to the bottom of the messages container
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    });

  socket.on('banned', (channel_id: number) => {
      socket.emit('removeFromRoom', {channel_id: channel_id}, (response) => {
          if (response)
              toast.add({ severity: 'error', summary: 'You got banned' , detail: '', life: 3000 });
      })
  })

  socket.on('unbanned', (channel_id: number) => {
      socket.emit('joinToRoom', {channel_id: channel_id}, (response) => {
          if (response)
              toast.add({ severity: 'error', summary: 'You are unbanned' , detail: '', life: 3000 });
      })
  })

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

onUpdated(() => {
  // Scroll to the bottom of the messages container after an update (e.g., when new messages are added)
  scrollToBottom();
});

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
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

</script>


<style>

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.channel-name-button {
  display: flex;
  align-items: center;
  justify-content: center;
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

.channel-name-button b {
margin-right: 10px; /* Adjust the value as needed */
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

.messages-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Add vertical scroll when content overflows */
    max-height: 70vh; /* Adjust this value as needed */
}
</style>
