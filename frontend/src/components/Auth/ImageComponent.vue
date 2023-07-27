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
      const accesstoken = getCookie('auth');
      const response = await axios.get('http://localhost:3000/auth/2fa', {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        }
      });
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
  