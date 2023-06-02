<template>
    <div class="chat">
        <div v-if="isChannel">
            <div class="chat-box">
                <h2> {{ activeChannel }} </h2>
                <ul id="chatMessages">
                <!-- Chat messages will be dynamically added here -->
                </ul>
            </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { onBeforeMount, ref, setBlockTracking } from 'vue'

interface Player {
    username: string
}

interface Channel {
    name: string
}

interface Message {
    sender: string;
    channel: string;
    text: string;
}

const socket = io('http://localhost:3000'); //connect socket to backend

const logged = ref(false);
const name = ref('');
const content = ref('');
const onlinePlayers = ref<Player[]>([]);
const channels = ref<Channel[]>([]);
const activeChannel = ref('');
const isChannel = ref(false);

const chat = {
    channel1: [],
    channel2: [],
    channel3: []
}

const messages = ref<Message[]>([]);

onBeforeMount(() => {
    socket.emit('findAllOnlinePlayers', {}, (response: Player[]) => {
        onlinePlayers.value = response;
    });

    socket.emit('findAllChannels', {}, (response: Channel[]) => {
        channels.value = response;
    });

    // socket.emit('findAllChannelMessages', { channelName: activeChannel.value }, (response: Message[]) => {
    //     chat[activeChannel.value].push = response;
    // })

    socket.on('player', (player) => {
        onlinePlayers.value.push(player);
    })

    socket.on('message', (message) => {
        messages.value.push(message);
    });

});

const addPlayer = () => {
    socket.emit('addPlayer', { username: name.value }, () => {
        logged.value = true;
    })
}

const changeChannel = (channel_name: string) => {
    socket.emit('join', { playerName: name.value, channelName: channel_name}, () => {
        isChannel.value = true;
        activeChannel.value = channel_name;
        console.log('hello');
    })
}


</script>


<style>

.chat-container {
    padding: 20px;
    display: flex;
    height: 100vh;
}

/* Sidebar */
.sidebar {
    flex: 1;
    padding: 20px;
    background-color: #f1f1f1;
}

.sidebar h4 {
    margin-top: 0;
}

/* Main Content */
.main {
    flex: 2;
    padding: 20px;
    background-color: #ffffff;
}

/* Chat Box */
.chat-box {
    margin-top: 20px;
    flex-direction: column;
    background: white;
    height: 75vh;
    padding: 1em;
    overflow: auto;
    max-width: 350px;
    margin: 0 auto 2em auto;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)
}

/* List Items */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    margin-bottom: 10px;
}


</style>