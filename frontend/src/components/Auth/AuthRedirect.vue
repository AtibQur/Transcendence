<template>
        <h1>Login Successfull!</h1>
        <h2>Welcome {{ name }}</h2>
    <div>
        <div>
            "Set username here! ..."
        </div>
        <div id="imageContainer"></div>

    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import { onMounted ,ref } from 'vue';

    const name = ref("");
    const imageUrl = 'https://localhost:3000/auth/42';
    const imageElement = document.createElement('img');
    const answerLoaded = ref(false);

    async function fetchName() {
        try {
            const response = await axios.get('http://localhost:3000/auth/FetchUser');
            name.value = response.data;
            answerLoaded.value = true;
            return name.value;
        } catch (error) {
            console.log("Error: Could not fetch name");
        }
    }

    async function setImage() {
        imageElement.src = imageUrl;
        imageElement.alt = 'Image';
        const container = document.getElementById('imageContainer');
        if (container) {
            container.appendChild(imageElement);
        }
    }


    onMounted(() => {
        fetchName();
        setImage();
    })

</script>

<style>
    
</style>