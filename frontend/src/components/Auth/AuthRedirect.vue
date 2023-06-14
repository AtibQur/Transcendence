<template>
        <h1>Login Successfull!</h1>
        <h2>Welcome {{ name }}</h2>
    <div>
        <div>
            Your 2FA code is:
            <ImageComponent />
        </div>
        <form>
            <label for="digitInput">Enter your verification code: </label>
            <input type="number" id="digitInput" name="digitInput" maxlength="6" minlength="6">
            <handleSubmit />
        </form>
        <div>
            user: {{ user }}
        </div>
    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import { onMounted ,ref } from 'vue';
    import ImageComponent from './ImageComponent.vue';
    import handleSubmit from './SubmitButtonComponent.vue'
    
    const name = ref("");
    const user  = ref("");
    const answerLoaded = ref(false);
    const token = "d61958253f32f529af99627f6a8ef6df37f66931b0f6bdda17a6c918447787b0";
    
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
    
    async function fetchUser() {
        try {
            const response = await axios.get('http://localhost:3000/auth/status',
                { headers: { Authorization: `Bearer ${token}` } });
            user.value = response.data;
            answerLoaded.value = true;
            console.log(user.value);
            return user.value;
        } catch (error) {
            console.log("Error: Could not fetch user");
        }
    }

    async function getAccessToken() {
        const response = await axios.post('http://localhost:3000/auth/login',
            // email: 'username',
            // password: 'password'
        );
    }

    onMounted(() => {
        fetchName();
        fetchUser();
    })

</script>

<style>
    
</style>