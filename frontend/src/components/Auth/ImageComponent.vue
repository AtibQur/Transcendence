w<template>
    <div>
      <img :src="imageData" alt="Image" v-if="imageData" />
    </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  import { getCookie } from '../../components/cookie_utils';
  
  const imageData = ref<string>(null!);

  const fetchImage = async () => {
    try {
      const payload = getCookie('payload');
      const response = await axios.post<string>('http://localhost:3000/auth/2fa', { payload });
      imageData.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };

  export default defineComponent({
    name: 'ImageComponent',
    setup() {
      return {
        imageData,
        fetchImage
      };
    },
    mounted() {
      this.fetchImage();
    }
});
</script>
  