<template>
    <div>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup lang="ts">
    import { removeCookie, getCookie } from './cookie_utils';
    import  axiosInstance from '../axiosConfig';
    import { removeDefaultAuthHeader } from '../axiosConfig';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    async function logout() {
        const accesstoken = getCookie('auth');
        if (accesstoken === undefined) {
            router.push('http://localhost:8080/auth')
        } else {
            try {
                removeCookie('auth');
                removeDefaultAuthHeader();
                router.push({ name: 'Home' });
            } catch (error) {
                console.log("Error logging out");
            }
        }
    }
</script>