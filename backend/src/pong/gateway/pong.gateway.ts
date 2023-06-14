import {
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	WebSocketGateway,
	WebSocketServer,
	// OnGatewayInit,
	// OnGatewayConnection,
	// OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { PongService } from '../pong.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})

export class PongGateway {
	@WebSocketServer() 
	server: Server;

	@SubscribeMessage('movement')
	handleMovement(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any): void {
		console.log(data);
		this.server.emit('state', data);
	}

	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() id: number): void {
		console.log(id);
		console.log('joined waiting room');
	}
}
