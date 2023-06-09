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
            <div class="right-side-bar">
                <ChannelmemberDisplay/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref } from 'vue';
import AddPlayer from './AddPlayer.vue'
import ChannelDisplay from './ChannelDisplay.vue'
import AddChannel from './AddChannel.vue';
import ChatBox from './ChatBox.vue';
import AddMessage from './AddMessage.vue';
import OnlinePlayers from './OnlinePlayers.vue';
import ChannelmemberDisplay from './ChannelDisplay.vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();
const logged = ref(false);
const inChannel = ref(false);
const username = ref('');
const playerId = ref(-1);
const channelId = ref(-1); //test

// const logIn = (playerInfo: {username: string, playerId: number}) => {
//     username.value = playerInfo.username;
//     playerId.value = playerInfo.playerId;
//     logged.value = true;
// }

const changeChannel = (channel_id: number) => {
    channelId.value = channel_id;
    inChannel.value = true;
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