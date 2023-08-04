<template>
        <h1>Welcome</h1>
    <div>
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
    import { ref } from 'vue';
    import { getCookie, removeCookie, setCookie } from '../../components/cookie_utils';
    import { useRouter } from 'vue-router';


    const inputValue = ref("");
    const router = useRouter();

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
                    router.push(process.env.VUE_APP_HOST_COMPUTER + ":8080/");
                }
            }
            )
        } catch (error) {
            console.log("Error: Could not verify 2fa code");
        }
    }
</script>

<style>
    
</style>