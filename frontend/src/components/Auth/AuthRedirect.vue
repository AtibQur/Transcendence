<template>
        <h1>Login Successfull!</h1>
        <h2>Welcome {{ name }}</h2>
    <div>
        <div>
            "Set username here! ..."
        </div>
    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import { onMounted ,ref } from 'vue';

    const name = ref("");
    const answerLoaded = ref(false);

    async function fetchName() {
        try {
            const response = await axios.get('http://localhost:3000/auth/FetchUser');
            name.value = response.data;
            answerLoaded.value = true;
            console.log("name" + name.value);
            return name.value;
        } catch (error) {
            console.log("Error: Could not fetch name");
        }
    }
    
    onMounted(() => {
        fetchName();
    })

</script>

<style>
    
</style>