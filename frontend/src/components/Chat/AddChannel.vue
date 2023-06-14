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

const props = defineProps({
    playerId: {
        type: Number,
        required: true
    }
});

const newChannelName = ref('');

const createChannel = () => {
    socket.emit('addChannel', {name: newChannelName.value, is_private: false, owner_id: props.playerId}, () => {
        newChannelName.value = '';
    });
}

</script>

<style>

</style>