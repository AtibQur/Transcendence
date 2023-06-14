<template>
    <div class="chat">
        <div class="login" v-if="!playerStore.getIsLogged">
            <!-- Load user -->
            <AddPlayer/>
        </div>
        <div class="chat-start-page" v-else>
            <div class="left-side-bar">
                <h3>Welcome {{ playerStore.getUsername }} {{ playerStore.getPlayerId }}!</h3>
                <ChannelDisplay :playerId="playerStore.getPlayerId" @changeChannel='changeChannel'/>
                <AddChannel :playerId="playerStore.getPlayerId"/>
                <OnlinePlayers :playerId="playerStore.getPlayerId"/> 
            </div>
            <div class="chat-box">
                <div v-if="inChannel">
                    <ChatBox :playerId="playerStore.getPlayerId" :channelId="channelId"/>
                    <AddMessage :senderId="playerStore.getPlayerId" :channelId="channelId"/>
                </div>
            </div>
            <div class="right-side-bar" v-if="inChannel">
                <ChannelmemberDisplay :channelId="channelId" />
                <!-- if player is admin; how to retrieve this from the back end? -->
                <AddChannelmember :channelId="channelId"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AddPlayer from './AddPlayer.vue'
import ChannelDisplay from './ChannelDisplay.vue'
import AddChannel from './AddChannel.vue';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import OnlinePlayers from './OnlinePlayers.vue';
import ChannelmemberDisplay from './ChannelmemberDisplay.vue';
import AddChannelmember from './AddChannelmember.vue';
import { usePlayerStore } from '@/stores/player';
import axiosInstance from '../../axiosConfig';

const playerStore = usePlayerStore();
const logged = ref(false);
const inChannel = ref(false);
const isAdmin = ref(false);
const username = ref('');
const channelId = ref(-1); //test

const changeChannel = (channel_id: number) => {
    channelId.value = channel_id;
    inChannel.value = true;
    isAdmin.value = fetchIsAdmin(playerStore.getPlayerId, channel_id);
}

const fetchIsAdmin = async (player_id: number, channel_id: number) => {
    const response = await axiosInstance.get('channelmember/admin/' + player_id.toString() + '/' + channel_id.toString());
    console.log(response.data);
    return response.data;
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