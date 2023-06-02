import {
	SubscribeMessage,
	MessageBody,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
  } from '@nestjs/websockets';
// import { subscribe } from 'diagnostics_channel';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	@SubscribeMessage('move')
	handleMove(@MessageBody() data: string): string {
		return data;
	}
		// @ConnectedSocket() client: Socket,
		// this.server.emit('updateGame', data)
}
