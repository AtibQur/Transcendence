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
                <button @click="openConfirmDialog">Leave Chat</button>
                <div v-if="isOwner">
                    <PasswordSettings :channelId="channelId"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { socket } from '@/socket';
import ChannelDisplay from './ChannelDisplay.vue'
import AddChannel from './AddChannel.vue';
import Toast from 'primevue/toast';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import ChannelmemberDisplay from './ChannelmemberDisplay.vue';
import AddChannelmember from './AddChannelmember.vue';
import axiosInstance from '../../axiosConfig';
import DmDisplay from './DmDisplay.vue';
import PasswordSettings from './PasswordSettings.vue'
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const username = sessionStorage.getItem('username') || '0';
const inChannel = ref(false);
const isAdmin = ref(false);
const isOwner = ref(false);
const channelId = ref(null);

const changeChannel = async (channel_id: number) => {
    channelId.value = channel_id;
    inChannel.value = true;
    await fetchPlayerInfo();
}

const fetchPlayerInfo = async () => {
    const response = await axiosInstance.get('channelmember/info/' + playerId.toString() + '/' + channelId.value.toString());
    if (response.data)
    {
        isAdmin.value = response.data.is_admin;
        isOwner.value = response.data.is_owner;
    }
    else {
        console.log("Error could not fetch player info");
    }
}

//CONFIRM DIALOG BUTTON
const openConfirmDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            leaveChat();
        }
    });
};

const leaveChat = async () => {

    await socket.emit('leaveRoom', {player_id: playerId, channel_id: channelId.value}, (response) => {
        if (response)
        {
            inChannel.value = false;
            toast.add({ severity: 'info', summary: 'Left Channel Succesfully', detail: '', life: 3000 });
        }
        else 
            toast.add({ severity: 'error', summary: 'Error you did not leave the Channel', detail: '', life: 3000 });
    })
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