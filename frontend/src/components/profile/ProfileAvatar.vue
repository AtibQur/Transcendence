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
      const formData = new FormData();
      formData.append('avatar', file.value);
      console.log(formData);
      await axiosInstance.post('player/avatar/upload/4', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };
  </script>
  