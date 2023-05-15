<template>
    <div class="chat">
      <h1>Chat</h1>
      <div v-if="!joined"> 
        <form @submit.prevent="join">
            <label> What's your name?</label>
            <input v-model="name" />
            <button type="submit">Send</button>
        </form>
      </div>
      <div class="chat-container" v-else>
        <div class="messages-container">
            <div v-for="message in messages" :key="message.id">
                [{{ message.name }}]: {{ message.text }}
            </div>
        </div>

        <div v-if="typingDisplay">{{ typingDisplay }}</div>

        <!-- <hr /> -->

        <div class="message-input">
            <form @submit.prevent="sendMessage">
                <label>Message:</label>
                <input v-model="messageText" @input="emitTyping" />

                <button type="submit">Send</button>
            </form>
        </div>

        <div v-if="typingDisplay"> {{ typingDisplay }}</div>
      </div>
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
    id: number;
}

const messages = ref<Message[]>([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');

onBeforeMount(() => {
	// add exception if there are networking problems
    socket.emit('findAllMessages', {}, (response: Message[]) => {
        console.log(response);
        messages.value = response;
    });

    socket.on('message', (message) => {
        messages.value.push(message);
    });

    socket.on('typing', ({ name, isTyping }) => {
        if (isTyping) {
            typingDisplay.value = `${name} is typing...`;
        } else {
            typingDisplay.value = '';
        }
    });
});

const join = () => {
    socket.emit('join', { name: name.value}, () => {
        joined.value = true;
    })
}

const sendMessage = () => {
    socket.emit('createMessage', {text: messageText.value}, () => {
        messageText.value = '';
    })
}

let timeout;

const emitTyping = () => {
    socket.emit('typing', { isTyping: true });
    timeout = setTimeout(() => {
        socket.emit('typing', { isTyping: false });
    }, 2000);
}

  </script>


<style>

.chat {
    padding: 20px;
    height: 100vh;
}

.messages-container {
    flex: 1;
}



</style>