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

@WebSocketGateway()
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
}
