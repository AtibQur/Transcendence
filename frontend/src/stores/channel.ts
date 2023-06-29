// import { socket } from '@/socket';

// export const useChatStore = defineStore('channel', {
//     state: () => ({
//         //initialize
//         channels: [] ,
//         currentChannel: -1 as number
//     }),
//     // getters: {

//     // },
//     actions: {
//         async loadChannels(id: number) {
//             //get and save channels
//             console.log(id);
//             const data = await socket.emit('findPlayerChannels', id);
//             console.log(data);
//             //join all channels
//         }
//     },
// });