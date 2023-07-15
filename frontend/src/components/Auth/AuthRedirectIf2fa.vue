<template>
        <h1>Welcome {{ intraName }}</h1>
    <div>
        <div>
            Your 2FA code is:
            <ImageComponent />
        </div>
        <form>
            <label for="digitInput">Enter your verification code: </label>
            <handleSubmit />
        </form>
    </div>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import AxiosInstance  from '../../axiosConfig';
    import { setDefaultAuthHeader } from '../../axiosConfig';
    import { onMounted ,ref } from 'vue';
    import ImageComponent from './ImageComponent.vue';
    import handleSubmit from './SubmitButtonComponent.vue'
    import CookieComponent from './cookieComponent.vue';
    import { getCookie, setCookie } from '../../components/cookie_utils';
    
    let accesstoken:string;
    const intraName = ref("");
    const intraId = ref("");
    const playerId = ref("");
    
    // async function getAccessToken() {
    //     try {
    //         accesstoken = getCookie('auth')
    //         setDefaultAuthHeader(accesstoken);
    //     } catch (error) {
    //         console.log("Error retrieving cookie");
    //     }
    // }

    // async function fetchUsername() {
    //     try {
    //         const response = await AxiosInstance.get('/user/username');
    //         intraName.value = (response.data);
    //         return intraName.value;
    //     } catch (error) {
    //         console.log("Error: Could not fetch username");
    //     }
    // }

    // async function fetchIntraId() {
    //     try {
    //         const response = await AxiosInstance.get('http://localhost:3000/user/intraId');
    //         intraId.value = (response.data);
    //         return intraId.value;
    //     } catch (error) {
    //         console.log("Error: Could not fetch intra id");
    //     }
    // }

    // async function fetchPlayerId() {
    //     try {
    //         const response = await AxiosInstance.get('http://localhost:3000/user/id');
    //         playerId.value = (response.data);
    //         return playerId.value;
    //     } catch (error) {
    //         console.log("Error: Could not fetch player id");
    //     }
    // }

    onMounted(() => {
        // getAccessToken();
        // fetchUsername();
        // fetchIntraId();
        // fetchPlayerId();
    })

</script>

<style>
    
</style>