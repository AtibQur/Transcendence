<template>
    <div class="channel-container">
        <h4>Available Channels</h4>
        <ul id="channelList">
            <button v-for="(channel, index) in channels" :key="index" @click="changeChannel(channel.name)">
                {{ channel.name }}
            </button>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({ id: Number });

const channels = ref({});

</script>