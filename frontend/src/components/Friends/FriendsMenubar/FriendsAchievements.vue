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

<style>
.scrollable-container {
display: flex;
flex-wrap: wrap;
justify-content: space-evenly;
align-items: flex-start;
margin-top: 30px;
width: 150%;
height: 700px;
min-height: 500px;
border: 2px solid #131780;
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
border: 1px solid #131780;
border-radius: 8px;
margin: 5px;
padding: 10px;
margin-left: 2px;
flex-basis: 30%;
transition: background-color 0.3s ease;
}

.item:hover {
background-color: lightgray;
}

.image-container {
width: 80px;
height: 80px;
margin-right: 10px;
border: 2px solid #ccc;
border-radius: 4px;
}

.image-container img {
width: 100%;
height: 100%;
object-fit: cover;
}

.name-container {
flex: 1;
}

.item-name {
text-align: center;
}

.bold-black {
font-weight: bold;
font-size: large;

color: black;
}

.regular-grey {
font-weight: normal;
font-size: large;
color: grey;
}
</style>
