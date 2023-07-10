<template>
  <div class="ProfileContainer">
    <div class="ProfileData">
      <div class="ProfilePicture">
        <img :src="profilePicture" alt="Avatar" style="width:100%">
      </div>
      <div class="ProfileInfo">
        <div class="ProfileName">
          <h1>{{ playerName }}</h1>
        </div>
        <div class="ProfileStatus">
          <h3>status: {{ status }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import axiosInstance from '../../../axiosConfig';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'FriendsPage',
  setup() {
    const route = useRoute();

    const playerName = computed(() => route.params.playerName || '');
    const profilePicture = computed(() => route.params.profilePicture || '');
    const status = computed(() => route.params.status || '');

    return {
      playerName,
      profilePicture,
      status,
    };
  },
});
</script>

<style scoped>
.ProfileContainer {
  position: absolute;
  left: 400px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 800px);
  min-width: 1500px;
  height: 75vh;
  min-height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
}
  
  .ProfileData {
    position: absolute;
    left: 12%;
    top: 10%;
    width: 20%;
    height: 50%;
    margin-top: 10px;
    /* border: 1px solid black; */
  }
  .ProfileData .ProfilePicture {
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    width: 100%;
    height: 60%;
    /* border: 1px solid black; */
  }
  .ProfileData .ProfilePicture img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .ProfileData .ProfileInfo {
    position: absolute;
    left: 0%;
    top: 60%;
    width: 100%;
    height: 40%;
    /* border: 1px solid black; */
  }
</style>