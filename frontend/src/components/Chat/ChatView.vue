<template>
    <div class="chat">
        <div class="login" v-if="!logged">
            <AddPlayer @logIn='logIn'/>
        </div>
        <div class="chat-start-page" v-else>
            <h3>Welcome {{ username }} {{ id }}!</h3>
            <div class="side-bar">
                <ChannelDisplay :id="id"/>
                <AddChannel/>
                <!-- <OnlinePlayers/> -->
            </div>
            <div class="chat-container">
                <!-- <ChatBox/>
                <ChatInput/> -->
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

const logged = ref(false);
const username = ref('');
const id = ref(-1);

const logIn = (playerInfo: {username: string, player_id: number}) => {
    username.value = playerInfo.username;
    id.value = playerInfo.player_id;
    logged.value = true;
}

</script>


<style>

.side-bar {
    flex: 1;
    padding: 20px;
    background-color: #f1f1f1;
}

</style>