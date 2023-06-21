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

	private waitingList: number[] = [];
	constructor(
		private readonly pongService: PongService,
	) {}

	@SubscribeMessage('movement')
	handleMovement(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any): void {
		this.pongService.handleMovement(client, data)
		// this.server.emit('state', data);
	}

	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() id: number): void {
		console.log('player', id, 'joined waiting room');

		this.waitingList.push(id);
		console.log('added', id, 'to waitinglist')
		if (this.waitingList.length > 1){
			console.log('two people in waiting list');
		const player2_id = this.waitingList.pop()
		const player1_id = this.waitingList.pop()
		this.server.emit('startMatch', { player1_id, player2_id});
		}
	}

	afterInit(@ConnectedSocket() client: Socket): void {
		// setInterval(() => this.pongService.tick(client), 1000 / 60);
	}
}
