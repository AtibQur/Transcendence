<template>
    <div>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup lang="ts">
    import { removeCookie, getCookie } from './cookie_utils';
    import  axiosInstance from '../axiosConfig';
    import { removeDefaultAuthHeader } from '../axiosConfig';

    async function logout() {
        const accesstoken = getCookie('auth');
        if (accesstoken === undefined) {
            window.location.replace('http://localhost:8080/auth')
        } else {
            try {
                removeCookie('auth');
                removeDefaultAuthHeader();
                await axiosInstance.get('/user/logout');
            } catch (error) {
                console.log("Error logging out");
            }
        }
    }
</script>