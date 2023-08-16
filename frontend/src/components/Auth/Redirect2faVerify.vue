<template>
    <div>
        <h1>Your Google Authenticator QRcode </h1>
    </div>
    <div>
        <div>
            <ImageComponent />
        </div>
        <div>
            <h3>
                Please scan the QRcode with your Google Authenticator app to link your account to our application.
            </h3>
            <button @click=goToProfile() class="custom-button-1">Back to Profile</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ImageComponent from './ImageComponent.vue';
    import { onMounted } from 'vue';
    import axiosInstance from '@/utils/axiosConfig';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const enableTFA = async () => {
        await axiosInstance.patch('/user/enable2fa', {two_factor_enabled: true});
    };

    onMounted(() => {
        enableTFA();
    });

    function goToProfile() {
        router.push({name: 'profile'});
    }

</script>