<template>
    <div class="create-chat-button">
        <form @submit.prevent="createChannel">
            <input v-model="newChannelName" placeholder='Create a new channel'/>
            <button type="submit">Create</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { ref } from 'vue';

const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const newChannelName = ref('');

const createChannel = () => {
    socket.emit('addChannel', {name: newChannelName.value, is_private: false, owner_id: playerId}, () => {
        newChannelName.value = '';
    });
}

</script>

<style>

</style>