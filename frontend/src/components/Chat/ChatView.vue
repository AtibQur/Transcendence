<template>
    <div class="chat">
        <div class="login" v-if="!playerId">
            <h3> Please log in </h3>
        </div>
        <div class="chat-start-page" v-else>
            <div class="left-side-bar">
                <h3>Welcome {{ username }} {{ playerId }}!</h3>
                <ChannelDisplay @changeChannel='changeChannel'/>
                <AddChannel/>
                <DmDisplay/> 
            </div>
            <div class="chat-box">
                <div v-if="inChannel">
                    <ChatBox :channelId="channelId"/>
                    <AddMessage :channelId="channelId"/>
                </div>
            </div>
            <div class="right-side-bar" v-if="inChannel">
                <ChannelmemberDisplay :channelId="channelId" />
                <div v-if="isAdmin">
                    <AddChannelmember :channelId="channelId"/>
                </div>
                <!-- <button @click="leaveChat">Leave Chat</button> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChannelDisplay from './ChannelDisplay.vue'
import AddChannel from './AddChannel.vue';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import ChannelmemberDisplay from './ChannelmemberDisplay.vue';
import AddChannelmember from './AddChannelmember.vue';
import axiosInstance from '../../axiosConfig';
import DmDisplay from './DmDisplay.vue';

const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const username = sessionStorage.getItem('username') || '0';
const inChannel = ref(false);
const isAdmin = ref(false);
const channelId = ref(null);

const changeChannel = async (channel_id: number) => {
    channelId.value = channel_id;
    inChannel.value = true;
    isAdmin.value = await fetchIsAdmin();
}

const fetchIsAdmin = async () => {
    const response = await axiosInstance.get('channelmember/admin/' + playerId.toString() + '/' + channelId.value.toString());
    return response.data;
}

// const leaveChat = async () => {

// }

</script>


<style>

.chat-start-page {
    display: flex;
}

.left-side-bar,
.right-side-bar {
    flex: 1;
    padding: 10px;
    background-color: #f1f1f1;
}

/* Chat Box */
.chat-box {
    flex: 3;
    flex-direction: column;
    background: white;
    overflow: auto;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)
}


</style>