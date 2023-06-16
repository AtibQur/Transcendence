<template>
  <div class="Friends-Menu">
    <div class="bar" @click="toggleMenu">Friends</div>
    <div class="menu" :class="{ 'slide-in': isOpen }"></div>
    <div v-if="isOpen" class="overlay" @click="toggleMenu"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    closeMenu() {
      this.isOpen = false;
    }
  },
  created() {
    this.$router.afterEach(() => {
      this.isOpen = false;
    });
  }
});
</script>

<style scoped>
.hamburger-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 999;
}

.bar {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  z-index: 1000;
  transition: background-color 0.3s, color 0.3s;
}

.bar:hover {
  background-color: #fff;
  color: #000;
}

.menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 370px;
  max-width: 370px;
  height: 100vh;
  background-color: #fff;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.slide-in {
  transform: translateX(0);
  transition: transform 0.5s ease-out;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 1000;
}

.open .menu {
  z-index: 1001;
}
</style>