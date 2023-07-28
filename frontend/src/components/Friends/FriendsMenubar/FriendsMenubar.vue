<template>
  <div class="menu-wrapper">
    <div class="Friends-Menu">
      <div class="bar" @click="toggleMenu">
        <h1>{{ buttonText }}</h1>
      </div>
      <div class="menu" :class="{ 'slide-in': isOpen }">
        <div v-if="isOpen" class="menu-content">
          <LoadFriends @closeMenu="closeMenu" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import LoadFriends from "./LoadFriends.vue";
export default defineComponent({
  data() {
    return {
      isOpen: false,
      buttonText: 'Friends'
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    closeMenu() {
      this.isOpen = false;
      this.buttonText = 'Friends';
    }
  },
  created() {
    this.$router.afterEach(() => {
      this.isOpen = false;
      this.buttonText = 'Friends';
    });
  },
  components: {
    LoadFriends
  }
});
</script>
<style scoped>
body {
  cursor: none;
}
.menu-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}
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
  border:none; 
  border-radius:10px;
  min-width: 140px;
  background-color: var(--white-transparent);
  color: var(--black-soft);
  padding: 10px 20px;
  z-index: 1000;
  transition: background-color 0.3s, color 0.3s;
}
.bar h1 {
  margin: 0;
  font-size: 20px;
}
.bar:hover {
  background-color: var(--blue-dark-transparent);
  color: var(--white-softblue);
  transition: 0.3s;
}
.menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 370px;
  max-width: 370px;
  height: 100vh;
  background-color: #ABD0DD;
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
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
.close {
  cursor: pointer;
  background-color: var(--black-soft);
  color: #ABD0DD;
  padding: 10px 20px;
  transition: background-color 0.3s, color 0.3s;
}
.close:hover {
  background-color: #fff;
  color: var(--black-soft);
}
</style>