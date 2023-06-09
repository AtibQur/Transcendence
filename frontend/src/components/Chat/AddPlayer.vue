<template>
    <label> What's your name? </label>
    <input v-model="name" placeholder='Write your name'/>
    <button @click="playerStore.initPlayer(name)">Send</button>
</template>

<script setup lang="ts">
import { socket } from '../../socket'
import { onBeforeMount, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';

// const emit = defineEmits(['logIn']);

const name = ref('');

const playerStore = usePlayerStore();

// const addPlayer = () => {
//     socket.emit('addPlayer', { username: name.value }, (id: number) => {
//         emit('logIn', {username: name.value, playerId: id});
//     })
// }

</script>

<style>

</style>