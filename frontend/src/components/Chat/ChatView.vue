<template>
    <Toast :stacked="false"/>
    <div class="chat">
        <div class="login" v-if="!playerId">
            <h3> Please log in </h3>
        </div>
        <div class="chat-start-page" v-else>
            <div class="left-side-bar">
                <h3>Welcome {{ username }} {{ playerId }}!</h3>
                <ChannelDisplay @changeChannel='changeChannel'/>
                <AddChannel/>
                <DmDisplay @changeChannel="changeChannel"/> 
            </div>
            <div class="chat-box">
                <div v-if="inChannel || inDm">
                    <ChatBox @showInfo="showInfo" :channelId="channelId"/>
                    <AddMessage :channelId="channelId"/>
                    <ChannelInfoDisplay @showInfo="showInfo" @changeChannel="changeChannel" :channelId="channelId" :isVisible="showChannelInfo"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChannelDisplay from './ChannelDisplay.vue'
import ChannelInfoDisplay from './ChannelInfoDisplay.vue'
import AddChannel from './AddChannel.vue';
import Toast from 'primevue/toast';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import DmDisplay from './DmDisplay.vue';

const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const username = sessionStorage.getItem('username') || '0';
const inChannel = ref(false);
const inDm = ref(false);

const channelId = ref<number>(0);
const showChannelInfo = ref(false);

const changeChannel = async (channel_id: number, isChannel: boolean) => {
    channelId.value = channel_id;
    showChannelInfo.value = false;
    if (isChannel) {
        inChannel.value = true;
        inDm.value = false
    }
    else {
        inChannel.value = false;
        inDm.value = true;
    }
}

const showInfo = async (isVisible: boolean) => {
    if (inChannel.value)
        showChannelInfo.value = isVisible;
}

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