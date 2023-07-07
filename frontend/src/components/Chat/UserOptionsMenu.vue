<template>
    <h4> HELLO FROM {{ props.channelmemberId }}</h4>
</template>

<script setup lang="ts">
import axiosInstance from '../../axiosConfig';

const props = defineProps({
    channelmemberId: {
        type: Number,
        required: true
    }
});

</script>