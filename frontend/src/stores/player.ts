import { defineStore } from 'pinia';
import { socket } from '@/socket';
import axiosInstance from '../axiosConfig';
// import { useChatStore } from './channel';

export const usePlayerStore = defineStore('player', {
    state: () => ({
        //initialize
        playerId: -1 as number,
        username: '' as string,
        isLoggedIn: false as boolean,
        channels: [] as Record<number, string>
    }),
    getters: {
        getPlayerId(state) {
            return this.playerId;
        },
        getUsername(state) {
            return this.username;
        },
        getIsLogged(state) {
            return this.isLoggedIn;
        }
    },
    actions: {
        async initPlayer(name: string) {
            try {
                const response = await axiosInstance.post('/player/create', { username: name });
                this.playerId = response.data;
                this.isLoggedIn = true;
                this.username = name;

                //load channels for the current player in chatstore
                // await useChatStore().loadChannels(this.playerId);
                await socket.emit('joinAllRooms', this.playerId);
                
            } catch (error) {
                console.log('Error creating player: ', error);
            }
        }
    },
});