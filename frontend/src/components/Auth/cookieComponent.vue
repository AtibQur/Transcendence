<template>
    <div>
      <button @click="setCookie">Set Cookie</button>
      <button @click="getCookie">Get Cookie</button>
      <button @click="deleteCookie">Delete Cookie</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useCookies } from 'vue3-cookies';
  
  export default defineComponent({
    name: 'CookieComponent',
    setup() {
      const { cookies } = useCookies();
  
      const setCookie = () => {
        cookies.set('myCookie', 'Hello World');
      };
  
      const getCookie = () => {
        const value = cookies.get('session_cookie');
        console.log(value);
      };
  
      const deleteCookie = () => {
        cookies.remove('myCookie');
      };
  
      return {
        setCookie,
        getCookie,
        deleteCookie,
      };
    },
  });
  </script>
  