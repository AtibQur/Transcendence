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
  
  const uploadAvatar = () => {
    if (file.value) {
      const formData = new FormData();
      formData.append('avatar', file.value);
  
      axiosInstance
        .post('player/avatar/upload/43', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          // Handle the response
          console.log(response);
        })
        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    }
  };
  </script>
  