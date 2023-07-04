<template>
  <div class="user-options-popup">
    <ul>
      <li>
        <button class="options-button" @click="muteUser">Mute</button>
      </li>
      <li>
        <button class="options-button" @click="banUser">Ban</button>
      </li>
      <li>
        <button class="options-button" @click="makeAdmin">Make Admin</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

</script>

<style>

.options-button {
  background-color: transparent;
  cursor: pointer;
  color: #000;
  transition: color 0.3s;
  padding: 0;
  margin: 0;
}
</style>