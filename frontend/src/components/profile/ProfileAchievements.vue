<template>
  <div class="scrollable-container">
    <div class="content">
      <ul class="item-list">
        <li v-for="item in items" :key="item" class="item">
          <div class="image-container">
            <img :src="getImageForItem(item)" alt="Item Image">
          </div>
          <div class="name-container">
            <div class="item-name">{{ item }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.scrollable-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-top: 30px;
  width: 150%;
  height: 800px;
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
  margin-bottom: 10px;
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
</style>

<script>
export default {
  data() {
    return {
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8',
        'Item 9',
        'Item 10',
        'Item 11',
        'Item 12',
        'Item 13',
        'Item 14',
        'Item 15',
        'Item 16',
        'Item 17',
        'Item 18',
        'Item 19',
        'Item 20',
      ],
    };
  },
  methods: {
    getImageForItem(item) {
      // Add logic here to return the image source for each item
      // You can use a mapping or generate random images based on the item
      // For simplicity, let's assume the image filenames follow a pattern
      return `path/to/images/${item.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    },
  },
};
</script>