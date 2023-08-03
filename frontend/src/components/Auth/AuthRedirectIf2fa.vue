<template>
        <h1>Welcome</h1>
    <div>
        <div>
            <!-- Your 2FA code is: -->
            <!-- <ImageComponent /> -->
        </div>
        <form @submit="handleSubmit">
            <label for="digitInput">Enter your verification code: </label>
            <input type="number" v-model="inputValue" name="digitInput" maxlength="6" minlength="6">
            <input type="submit" value="Submit">
        </form>
    </div>
    <div>
        <h2>
            If you lost your account or phone please email us at tranceanddance123@gmail.com
        </h2>
        <h1>
            Ya Dumb Bitch
        </h1>
    </div>
</template>

<script setup lang="ts">
    import AxiosInstance  from '../../axiosConfig';
    import { setDefaultAuthHeader } from '../../axiosConfig';
    import { onMounted ,ref } from 'vue';
    import { getCookie, removeCookie, setCookie } from '../../components/cookie_utils';
    import { useRouter } from 'vue-router';


    const inputValue = ref("");
    // let accesstoken:string;
    const intraName = ref("");
    // const intraId = ref("");
    const router = useRouter();
    // const playerId = ref("");
    
    async function handleSubmit(event: Event) {
        event.preventDefault();
        const payload = getCookie('payload'); 
        const submittedValue = inputValue.value;
        
        try {
            await AxiosInstance.post('/auth/2fa/verify', {payload, submittedValue })
            .then((response) => {
                if (response.data == false) {
                    alert("Wrong 2fa code");
                }
                else {
                    setCookie('auth', response.data);
                    removeCookie('payload');
                    const accessToken = getCookie('auth');
                    setDefaultAuthHeader(accessToken);
                    router.push("http://localhost:8080/");
                }
            }
            )
        } catch (error) {
            console.log("Error: Could not verify 2fa code");
        }
    }
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
    //     fetchUsername();
    //     fetchIntraId();
    //     fetchPlayerId();
    })

</script>

<style>
    
</style>