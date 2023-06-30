<template>
    <div class="create-chat-button">
        <form @submit.prevent="addChannelmember">
            <input v-model="channelmemberName" placeholder='Add channelmember'/>
            <button type="submit">Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { ref } from 'vue';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelmemberName = ref('');

const addChannelmember = () => {
    socket.emit('addChannelmember', { channelmember_name: channelmemberName.value, channel_id: props.channelId }, () => {
        channelmemberName.value = '';
    })
}

</script>

<style>

</style>