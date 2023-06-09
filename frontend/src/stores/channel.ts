import Channel from '@/types/Channel';
import { defineStore } from 'pinia'

export const useChatStore = defineStore('channel', {
    state: () => ({
        //initialize
        channels: [] as Channel[]
    }),
    getters: {

    },
    actions: {

    },
});