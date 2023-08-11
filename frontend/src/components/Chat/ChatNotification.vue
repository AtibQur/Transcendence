<template>
  <Toast group='pt'>
    <template v-slot:icon>
      <i class="pi pi-comments" style="font-size: 2rem;"></i>
    </template>
  </Toast>
</template>

<script setup lang="ts">
  import { socket } from '../../utils/socket';
  import Toast from 'primevue/toast'
  import Message from '@/types/Message';
  import axiosInstance from '../../axiosConfig';
  import { onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  const playerId = parseInt(localStorage.getItem('playerId') || '0');
  const username = localStorage.getItem('username') || null;

  onMounted(async () => {
    socket.on('chatmessage', async (message: Message) => {
      await axiosInstance.get(`blockedplayer/player/${playerId.toString()}?username=${message.sender.username}`)
        .then((response) => {
          if (response.data == false) {
            if (message.sender.username != username) {
              var msgTrimmed = message.content;
              if (msgTrimmed.length > 25) {
                msgTrimmed = msgTrimmed.slice(0,25) + '...';
              }
              toast.add({
                severity: 'info',
                summary: message.sender.username,
                detail: msgTrimmed,
                group:'pt',
                life: 3000
              });
            }
          }
        });
    })
  })
</script>
