<template>
    <div class="chat">
        <div class="login" v-if="!logged">
            <AddPlayer @logIn='logIn'/>
        </div>
        <div class="chat-start-page" v-else>
            <div class="side-bar">
                <h3>Welcome {{ username }} {{ playerId }}!</h3>
                <ChannelDisplay :playerId="playerId" @changeChannel='changeChannel'/>
                <AddChannel :playerId="playerId"/>
                <!-- currently displays all players that exist -->
                <h3> {{ playerId }}</h3>
                <OnlinePlayers :playerId="playerId"/> 
            </div>
            <div class="chat-box">
                <div v-if="inChannel">
                    <ChatBox :playerId="playerId" :channelId="channelId"/>
                    <AddMessage :senderId="playerId" :channelId="channelId"/>
                </div>
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

const logged = ref(false);
const inChannel = ref(false);
const username = ref('');
const playerId = ref(-1);
const channelId = ref(-1); //test

const logIn = (playerInfo: {username: string, playerId: number}) => {
    username.value = playerInfo.username;
    playerId.value = playerInfo.playerId;
    logged.value = true;
}

const changeChannel = (channel_id: number) => {
    channelId.value = channel_id;
    inChannel.value = true;
}

</script>


<style>

.chat-start-page {
    display: flex;
}

.side-bar {
    flex: 1;
    padding: 20px;
    background-color: #f1f1f1;
}

/* Chat Box */
.chat-box {
    /* margin-top: 20px; */
    flex: 2;
    flex-direction: column;
    background: white;
    height: 75vh;
    padding: 1em;
    overflow: auto;
    max-width: 350px;
    margin: 0 auto 2em auto;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)
}


</style>