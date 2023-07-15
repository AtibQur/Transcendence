<template>
  <form @submit="handleSubmit">
    <input type="number" v-model="inputValue" name="digitInput" maxlength="6" minlength="6">
    <input type="submit" value="Submit">
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AxiosInstance  from '../../axiosConfig';
import { getCookie } from '../cookie_utils';

export default defineComponent({
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    handleSubmit(event: Event) {
      event.preventDefault();

      const payload = getCookie('payload');
      const submittedValue = this.inputValue;
      AxiosInstance.post('/auth/2fa/verify', { payload, submittedValue });
    },
  }
});
</script>
