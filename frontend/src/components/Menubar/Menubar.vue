<template>
  <div class="hamburger-menu" :class="{ 'open': isOpen }">
    <div v-if="!isOpen" class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="menu" :class="{ 'slide-in': isOpen }">
      <div class="menu-picture">
        <img src="../../assets/images/PONG_logo.png" alt="Menu Picture" />
      </div>
      <ul>
        <li><router-link to="/" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/play" @click="closeMenu">Play</router-link></li>
        <li><router-link to="/leaderboard" @click="closeMenu">Leaderboard</router-link></li>
        <li><router-link to="/chat" @click="closeMenu">Chat</router-link></li>
        <li><router-link to="/profile" @click="closeMenu">Profile</router-link></li>
      </ul>
    </div>
    <div v-if="isOpen" class="overlay" @click="toggleMenu"></div>
  </div>
</template>

  <script>
  export default {
    name: "HamburgerMenu",
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
  };
  </script>
  
  <style scoped>
.hamburger-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.hamburger {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 1000;
}

.hamburger span {
  display: block;
  width: 30px;
  height: 3px;
  background-color: #000;
  margin-bottom: 5px;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 400px;
  height: 100vh;
  background-color: #fff;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.slide-in {
  transform: translateX(0);
  transition: transform 0.5s ease-out;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

li:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: #b2dae7;
  transition: left 0.3s;
  z-index: -1;
}

li:hover:before {
  left: 0;
  z-index: 0;
}

li:after {
  content: "";
  position: absolute;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background-color: #b2dae7;
  transition: right 0.3s;
  z-index: -1;
}

li:hover:after {
  right: 0;
  z-index: 0;
}

a {
  text-decoration: none;
  color: #134279;
  cursor: pointer;
  font-size: 24px;
  position: relative;
  z-index: 2;
  font-weight: normal;
  transition: font-weight 0.3s, font-size 0.3s;
}

a:hover {
  cursor: pointer;
  color: #1f6091;
  font-weight: bold;
  font-size: 26px;
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

.menu-picture {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: #ccc 1px solid;
  padding: 20px 0px;
}

.menu-picture img {
  max-width: 100%;
  max-height: 100%;
}
</style>
