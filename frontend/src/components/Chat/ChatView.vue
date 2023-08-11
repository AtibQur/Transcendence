<template>
    <div class="chat">
        <div v-if="!playerId">
            <h3> Please log in </h3>
        </div>
        <div class="chat-start-page" v-else>
            <div class="left-side-bar">
                <ChannelDisplay @changeChannel='changeChannel'/>
                <DmDisplay @changeChannel="changeChannel"/> 
                <AddChannel/>
                <AddDm/>
                <JoinChannel/>
            </div>
            <div class="chat-box" :style="{ height: chatBoxHeight + 'px' }">
        <div class="chat-content" v-if="inChannel || inDm">
            <ChatBox @showInfo="showInfo" :channelId="channelId"/>
            <ChannelInfoDisplay 
                @showInfo="showInfo"
                @changeChannel="changeChannel"
                :channelId="channelId"
                :isDm="inDm"
                :isVisible="showChannelInfo"
            />
        </div>
        <div class="select-chat" v-else>
            <h3> Select a channel or DM to start chatting </h3>
        </div>
        <div class="add-message-wrapper" v-if="inChannel || inDm">
            <AddMessage :channelId="channelId"/>
        </div>
    </div>
            <div class="right-side-bar">
                <div class="profile-container">
                    <div class="ProfilePicture">
                        <img :src="profilePicture" alt="Avatar" style="width:100%">
                    </div>
                </div>
                <h2>{{ username }}</h2>
                <div class="status-circle">
                    <span class="status-text">
                        online
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onMounted, onUnmounted } from 'vue';
import axiosInstance from '../../axiosConfig';
import ChannelDisplay from './ChannelDisplay.vue';
import ChannelInfoDisplay from './ChannelInfoDisplay.vue';
import AddChannel from './AddChannel.vue';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import DmDisplay from './DmDisplay.vue';
import AddDm from './AddDm.vue';
import JoinChannel from './JoinChannel.vue';

const playerId = parseInt(localStorage.getItem('playerId') || '0');
const username = localStorage.getItem('username') || '0';
const profilePicture = ref('');
const inChannel = ref(false);
const inDm = ref(false);
const chatBoxHeight = ref<number>(1350);

const channelId = ref<number>(0);
const showChannelInfo = ref(false);

const changeChannel = async (channel_id: number, isChannel: boolean, isDm: boolean) => {
    channelId.value = channel_id;
    showChannelInfo.value = false;
    if (isChannel) {
        inChannel.value = true;
        inDm.value = false
    }
    else if (isDm) {
        inChannel.value = false;
        inDm.value = true;
    }
    else {
        inChannel.value = false;
        inDm.value = false;
    }
}

const showInfo = async (isVisible: boolean) => {
    showChannelInfo.value = isVisible;
}
onBeforeMount(async () => {
    try {
      profilePicture.value = await fetchAvatar(playerId);
    } catch (error) {
      console.log("Error occurred chat profile");
    }
  });

  const fetchAvatar = async (player_id: number) => {
    const response = await axiosInstance.get('player/avatar/' + player_id.toString());
    const imageBytes: Uint8Array = new Uint8Array(response.data.data);
    const imageUrl = ref<string | null>(null);
    imageUrl.value = URL.createObjectURL(new Blob([imageBytes]));
    return imageUrl.value;
  };

    // A method to adjust the chatbox height based on the window size
    const updateChatBoxHeight = () => {
        const windowHeight = window.innerHeight;
        chatBoxHeight.value = Math.min(windowHeight - 200, 1350); // Adjust as needed
    };

        // Listen to the window resize event and update the chatbox height
        onMounted(() => {
        updateChatBoxHeight(); // Initial update
        window.addEventListener('resize', updateChatBoxHeight);
    });
    // Clean up the event listener when the component is unmounted
    onUnmounted(() => {
        window.removeEventListener('resize', updateChatBoxHeight);
    });


</script>


<style scoped>
.chat-start-page {
    display: flex;
}

.left-side-bar {
    flex: 1;
    padding: 10px;
    background-color: var(--blue-light);
    border-top: 2px solid var(--gray-medium);
    margin-top: 100px;
}

.right-side-bar {
    flex: 1;
    padding: 10px;
    border-top: 2px solid var(--gray-medium);
    background-color: var(--blue-light);
    margin-top: 100px;
}

.profile-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ProfilePicture {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
}

.ProfilePicture img {
  height: 100%;
  width: auto;
}
.status-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 15px;
    margin-top: 50px;
    background-color: var(--green-soft);
  }

.status-text {
    margin-left: 40px;
    font-weight: bold;
  }

/* Chat Box */
.chat-box {
    flex: 3;
    display: flex;
    flex-direction: column;
    background: var(--white-softblue);
    overflow: auto;
    margin-top: 100px;
    border-top: 2px solid var(--gray-medium);
    border-bottom: 2px solid var(--gray-medium);
    border-left: 2px solid var(--gray-medium);
    border-right: 2px solid var(--gray-medium);
    position: relative; /* Ensure relative positioning context */
}

/* Chat Content */
.chat-content {
    flex: 1; /* Allow chat content to grow and push the AddMessage button to the bottom */
}

/* AddMessage Button */
.add-message-wrapper {
    margin-top: auto; /* Push the AddMessage button to the bottom */
}

/* Positioning the AddMessage button container at the bottom */
.add-message-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: var(--white-softblue);
    border-top: 2px solid var(--gray-medium);
    box-sizing: border-box;
}

.select-chat {
    color: var(--gray-dark);
    padding-top: 30%;
}

</style>
