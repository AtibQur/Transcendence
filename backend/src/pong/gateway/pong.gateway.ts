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

	private waitingList: string[] = [];
	// private gameFinished: boolean = false;
	constructor(
		private readonly pongService: PongService,
	) {}

	@SubscribeMessage('endGame')
	handleEndGame(
		@ConnectedSocket() client: Socket): void {
		console.log('Game concluded')
		// this.gameFinished = true;
		// console.log(this.gameFinished);
	}

	@SubscribeMessage('moveLeft')
	handleMoveLeft(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any): void {
		this.pongService.handleMoveLeft(client, data)
		// this.server.emit('state', data);
	}

	@SubscribeMessage('moveRight')
	handleMoveRight(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any): void {
		this.pongService.handleMoveRight(client, data)
		// this.server.emit('state', data);
	}

	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() socket_id: string): void {
		if (!this.waitingList.includes(socket_id)) {
			this.waitingList.push(socket_id);
			console.log('added', socket_id, 'to waitinglist');
		} else {
			console.log(socket_id, 'is already in the waiting list');
		}
		console.log('Waiting list:', this.waitingList);

		if (this.waitingList.length > 1){
			console.log('two people in waiting list');
			const p2 = this.waitingList.pop()
			const p1 = this.waitingList.pop()
			this.server.emit('startMatch', {p1, p2});
			this.pongService.resetGame()
		}
	}

	afterInit(@ConnectedSocket() client: Socket): void {
		// if (!this.gameFinished){
		setInterval(() => this.pongService.tick(client), 1000 / 60);
		// }
	}

	handleDisconnect(client: Socket): void {
		const disconnectedId = client.id
		console.log('player', disconnectedId, 'left the waiting list');
		const index = this.waitingList.indexOf(disconnectedId);
		if (index !== -1)
			this.waitingList.splice(index, 1);
		console.log('Waiting list:', this.waitingList);
		// this.gameFinished = true;
		this.server.emit('playerDisconnected', { id: client.id });
	}
}