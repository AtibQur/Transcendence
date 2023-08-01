<template>
  <div class="scrollable-container">
    <div class="content">
      <ul class="item-list">
        <li v-for="(value, key) in achievements" :key="key" class="item">
          <div class="image-container"></div>
          <div :class="['name-container', { 'bold-black': value, 'regular-grey': !value }]">
            <div class="item-name">{{ key }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, ref, SetupContext, watch } from 'vue';
import axiosInstance from '../../../axiosConfig';

export default {
  props: {
  friendId: {
    type: Number,
    required: true
  },
},
  setup(props: any, context: SetupContext) {
    const achievements = ref({});

    const fetchAchievements = async (friendId: number) => {
      const response = await axiosInstance.get(`player/achievements/` + friendId.toString());
      return response.data;
    };

    watch(() => props.friendId, async (newFriendId) => {
      try {
        achievements.value = await fetchAchievements(newFriendId);
      } catch (error) {
        console.log("Error occurred");
      }
    });

    onBeforeMount(async () => {
      if (props.friendId) {
        try {
          achievements.value = await fetchAchievements(props.friendId);
        } catch (error) {
          console.log("Error occurred");
        }
      }
    });

    return {
      achievements
    };
  }
};
</script>

<style scoped>
.scrollable-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  height: 700px;
  border-radius: 8px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: aliceblue;
}

.content {
  width: 100%;
}

.item-list {
  list-style-type: none;
  padding: 0;
}

.item {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-medium);
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
  flex-basis: 30%;
  transition: background-color 0.3s ease;
  background-color: var(--gray-light);
}

.unachieved-bg {
  background-color: var(--gray-light);
}

.achieved-bg {
  background-color: rgb(255, 252, 229);
}

.item:hover {
  mix-blend-mode:multiply;
}

.image-container {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  background-color: white;
  border-radius: 8px;
}

.image-container img {
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.unachieved {
  filter: grayscale(100%);
}

.name-container {
  flex: 1;
}

.item-name {
  text-align: center;
}

.bold-black {
  font-weight: bold;
  font-size: medium;
  color: black;
}

.regular-grey {
  font-weight: normal;
  font-size: medium;
  color: grey;
}
</style>
