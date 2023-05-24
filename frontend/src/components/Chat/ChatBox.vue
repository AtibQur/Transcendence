<template>
    <div class="chat">
        <h1>Chat</h1>
        <div v-if="!joined">
            <div v-if="!player">
                <form @submit.prevent="addPlayer">
                    <label> What's your name? </label>
                    <input v-model="name" placeholder='Write your name'/>
                    <button type="submit">Send</button>
                </form>
            </div>
            <div v-else>
                <label> Which channel would you like to join? </label>
                <button @click="joinChannel('Channel 1')">Channel 1</button>
                <!-- <button @click="joinChannel">Channel 2</button> -->
             </div>
        </div>
      
        <!-- <div class="chat-container" v-else>
            <div class="messages-container">
                <div v-for="message in messages" :key="message.id">
                    [{{ message.name }}]: {{ message.text }}
                </div>
            </div>
            <div v-if="typingDisplay">{{ typingDisplay }}</div>
            <hr />
            <div class="message-input">
                <form @submit.prevent="sendMessage">
                    <label>Message: </label>
                    <input v-model="messageText" placeholder='Write a message' @input="emitTyping" />
                    <button type="submit">Send</button>
                </form>
                <div v-if="showNotification"> -->
                    <!-- Notification message when someone joins -->
                    <!-- <p>{{ notificationMessage }}</p>
                </div>
                <button @click="clearAllMessages">Clear all</button>
                <button @click="leave">Leave chat</button>
            </div> -->
        <!-- </div> -->
    </div>
  </template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue'

const socket = io('http://localhost:3000'); //connect socket to backend

//not sure if this should be here, but otherwise it cannot infer the type of response
interface Message {
    name: string;
    text: string;
    id: string;
}

interface Player {
	id: string; //number;
	username: string;
}

const messages = ref<Message[]>([]);
const players = ref<Player[]>([]);
const messageText = ref('');
const joined = ref(false);
const player = ref(false);
const showNotification = ref(false);
const name = ref('');
// const typingDisplay = ref('');
// const notificationMessage = ref('');

onBeforeMount(() => {
	// add exception if there are networking problems
    socket.emit('findAllMessages', {}, (response: Message[]) => {
        messages.value = response;
    });

    socket.emit('findAllPlayers', {}, (response: Player[]) => {
        players.value = response;
    })

    socket.on('message', (message) => {
        messages.value.push(message);
    });

    // socket.on('typing', ({ name, isTyping }) => {
    //     if (isTyping) {
    //         typingDisplay.value = `${name} is typing...`;
    //     } else {
    //         typingDisplay.value = '';
    //     }
    // });

    // socket.on('userJoined', ({ name, newUser}) => {
    //   if (newUser) {
    //       notificationMessage.value = `${name} has joined the chat.`;
    //       showNotification.value = true;
          
    //       setTimeout(() => {
    //           showNotification.value = false;
    //         }, 3000);
    //     } else {
    //       notificationMessage.value = '';
    //   }
    // });

    // socket.on('userLeft', ({ name, hasLeft}) => {
    //   if (hasLeft) {
    //       notificationMessage.value = `${name} has left the chat.`;
    //       showNotification.value = true;
          
    //       setTimeout(() => {
    //           showNotification.value = false;
    //         }, 3000);
    //     } else {
    //       notificationMessage.value = '';
    //   }
    // });
});

const addPlayer = () => {
    socket.emit('addPlayer', {username: name.value})
    player.value = true;
}

const joinChannel = (channelName: string) => {
    socket.emit('join', {channelName: channelName, username: name.value, newUser: true}, () => {
        joined.value = true;
    })
}

// const createChannel = () => {

// }

// const sendMessage = () => {
//     socket.emit('createMessage', {text: messageText.value}, () => {
//         messageText.value = '';
//     })
// }

// let timeout;

// const emitTyping = () => {
//     socket.emit('typing', { isTyping: true });
//     timeout = setTimeout(() => {
//         socket.emit('typing', { isTyping: false });
//     }, 2000);
// }

// const clearAllMessages = () => {
//     socket.emit('clearAllMessages', {}, (response: Message[]) => {
//         messages.value = response;
//     });
// }

// const leave = () => {
//     socket.emit('leave', {name: name.value, isLeaving: true});
//     joined.value = false;
//     name.value = '';
// }

</script>


<style>

.chat {
    padding: 20px;
    height: 100vh;
}

.messages-container {
    background: white;
    height: 50vh;
    padding: 1em;
    overflow: auto;
    max-width: 350px;
    margin: 0 auto 2em auto;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)
}

</style>