<template>
    <div>
      <input type="file" @change="handleFileChange" />
      <button class="custom-button-1" @click="uploadAvatar">Upload</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axiosInstance from '@/utils/axiosConfig';
  
  const file = ref<File | null>(null);
  const emit = defineEmits(["avatarUploaded"]);
  const playerId = parseInt(localStorage.getItem('playerId') || '0');

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

    try {
      const response = await axiosInstance.post('player/avatar/upload/' + playerId.toString(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      emit('avatarUploaded', response.data.avatarBytes);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  }
};
  </script>
