import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000');
// export const socket = io('http://localhost:3000', { autoConnect: false });
  
// export const socket = io('http://localhost:3000', { 
//     auth: {
//         id: sessionStorage.getItem('playerId') || '0'
//     }
// });
