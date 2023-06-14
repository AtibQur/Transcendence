<template>
    <div>
        <p> {{ verified }} </p>
    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import { onMounted ,ref } from 'vue';
    
    const verified = ref("");
    const answerLoaded = ref(false);
    
    async function fetchVerifyStatus() {
        try {
            const response = await axios.get('http://localhost:3000/auth/2fa/verify');
            verified.value = response.data;
            answerLoaded.value = true;
            return verified.value;
        } catch (error) {
            console.log("Error: Could not fetch verified status");
        }
    }
    
    onMounted(() => {
        fetchVerifyStatus();
    })
</script>