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
        </div>
    </div>
</template>

<script setup lang="ts">
    import ImageComponent from './ImageComponent.vue';
    import { onMounted } from 'vue';
    import axiosInstance from '@/utils/axiosConfig';

    const enableTFA = async () => {
        await axiosInstance.get('/user/enable2fa');
    };

    onMounted(() => {
        enableTFA();
    });
</script>