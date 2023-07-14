<template>
  <form @submit="handleSubmit">
    <input type="submit" value="Submit">
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    handleSubmit(event: Event) {
      event.preventDefault();

      window.location.assign("http://localhost:8080/login/redirect2faverify");
    },
  },
});
</script>
