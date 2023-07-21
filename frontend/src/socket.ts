import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
    auth: {
        id: sessionStorage.getItem('playerId') || '0',
    }   
}     
    );//, { transports: ['websocket', 'polling', 'flashsocket'] });