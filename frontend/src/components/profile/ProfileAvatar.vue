<template>
    <div>
      <input type="file" @change="handleFileChange" />
      <button @click="uploadAvatar">Upload</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axiosInstance from '../../axiosConfig';
  
  const file = ref<File | null>(null);

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      file.value = target.files[0];
    }
  };
  
  const uploadAvatar = async () => {
    if (file.value) {
      const playerId = parseInt(localStorage.getItem('playerId') || '0');
      const formData = new FormData();
      formData.append('avatar', file.value);
      await axiosInstance.post('player/avatar/upload/' + playerId.toString(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };
  </script>
  