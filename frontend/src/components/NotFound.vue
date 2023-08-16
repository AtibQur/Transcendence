<template>
    <div class="PongLogo">
        PONG
    </div>
    <div class="welcome-container">
        <div class="welcome-box">
            <div class="PongLogo error">
                404
            </div>
            <h3 class="text"> Page not found! </h3>
            <div class="avatar-container">
                <div v-for="avatar in avatars" :key="avatar">
                    <img :src="`/trance_avatars/${avatar}`" alt="Avatar" class="avatar" />
                </div>
            </div>
            <br>
            <button @click=goToHome() class="custom-button-1">Back Home</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const avatars = ref<string[]>(['haseeb.png', 'maria.png', 'raav.png', 'ster.png', 'tessa.png']);
const router = useRouter();

function goToHome() {
    router.push({name: 'home'});
}

</script>

<style scoped>

.PongLogo {
  font-size: 100px;
  font-weight: bold;
  padding: 4%;
}

.welcome-container {
  display: flex;
  justify-content: center;
}

.welcome-box {
  background-color: var(--white-softgray);
  border-radius: 20px;
  padding: 4%;
  max-width: 40%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.text {
    font-size: 30px;
}

.error {
  font-size: 100px;
  padding: 0;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px;
  width: 100%
}

.avatar {
  width: 100%;
  height: 18%;
  border-radius: 50%;
}
</style>