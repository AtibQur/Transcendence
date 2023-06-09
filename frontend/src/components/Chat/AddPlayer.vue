<script setup lang="ts">
import { socket } from '../../socket'
import { onBeforeMount, ref } from 'vue';

const emit = defineEmits(['logIn']);

const name = ref('');

// onBeforeMount(() => {

//     socket.on('player', (player) => {
//     })

// });

const addPlayer = () => {
    socket.emit('addPlayer', { username: name.value }, (id: number) => {
        emit('logIn', {username: name.value, player_id: id}); // return to parent component
    })
}

</script>

<template>
    <h3> Hello </h3>
    <!-- <form @submit.prevent="addPlayer"> -->
        <label> What's your name? </label>
        <input v-model="name" placeholder='Write your name'/>
        <button @click="addPlayer">Send</button>
    <!-- </form> -->
</template>


<style>

</style>