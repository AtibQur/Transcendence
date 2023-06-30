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

const match = new Map<number, [p1: string, p2: string ]>();

@WebSocketGateway({
    cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})
export class PongGateway {
	@WebSocketServer() 
	server: Server;

	private waitingList: string[] = [];
	private gameEnded: boolean = false;
	// private matchStarted: boolean = false;
	constructor(
		private readonly pongService: PongService,
	) {}

	@SubscribeMessage('endGame')
	handleEndGame(
		@ConnectedSocket() client: Socket): void {
		// this.pongService.resetGame()
		this.gameEnded = true;
		console.log('Game has ended')
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

	generateMatchId(): number {
		let id = 1;
		if (match.size === 0)
			return (id)
		while (id > 0){
			if (match.has(id))
				id++
			else
				return (id)
		}
	}

	findMatchByPlayer(disconnectedId: string): number {
		console.log(disconnectedId)
		for (const [id, [p1, p2]] of match.entries()){
			if (p1 === disconnectedId || p2 === disconnectedId){
				return (id);
			}
		}
		return (0);
	}

	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, socket_id}: { player_id: number; socket_id: string }): void {
		if (!this.waitingList.includes(socket_id)) {
			this.waitingList.push(socket_id);
			console.log('added', player_id, socket_id, 'to waitinglist');
		} else {
			console.log(socket_id, 'is already in the waiting list');
		}
		console.log('Waiting list:', this.waitingList);

		if (this.waitingList.length > 1){
			console.log('two people in waiting list');
			const p2 = this.waitingList.pop()
			const p1 = this.waitingList.pop()

			const matchId = this.generateMatchId();

			match.set(matchId, [p1, p2]);

			this.server.emit('startMatch', {p1, p2});
			this.pongService.resetGame()
		}
	}

	afterInit(@ConnectedSocket() client: Socket): void {
		if (!this.gameEnded)
			setInterval(() => this.pongService.tick(client), 1000 / 60);
	}

	// handleDisconnect(client: Socket): void {
	// 	const disconnectedId = client.id

	// 	// const matchId = this.findMatchByPlayer(disconnectedId);
	// 	// console.log("MatchID", matchId)
	// 	// if (matchId) {
	// 	// 		this.server.emit('beforeunload', { id: match.get(matchId)});
	// 	// 		// this.server.emit('beforeunload', { id: matchId.p2});
	// 	// 		match.delete(matchId)
	// 	// }
	// 	const index = this.waitingList.indexOf(disconnectedId);
	// 	console.log('player', disconnectedId, 'left the waiting list');
	// 	console.log('Waiting list:', this.waitingList);
	// 	if (index !== -1){
	// 		this.waitingList.splice(index, 1);
	// 	}
	// 	this.gameEnded = true;
	// 	this.server.emit('playerDisconnected', { id: disconnectedId });
	// }
}