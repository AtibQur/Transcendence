<template>
    <Toast/>
    <div>
        <form @submit.prevent="addChannelmember">
            <input v-model="channelmemberName" placeholder='Add channelmember'/>
            <button type="submit">Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const toast = useToast();
const channelmemberName = ref('');

const addChannelmember = () => {
    socket.emit('addChannelmember', { channelmember_name: channelmemberName.value, channel_id: props.channelId }, () => {
        channelmemberName.value = '';
    })

    if (!channelmemberName.value)
        toast.add({ severity: 'error', summary: 'Error Channelmember not Added', detail: '', life: 3000 });
    else
        toast.add({ severity: 'info', summary: 'Added Channelmember successfully', detail: '', life: 3000 });
}

</script>
