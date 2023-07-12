// import {
// 	SubscribeMessage,
// 	MessageBody,
// 	ConnectedSocket,
// 	WebSocketGateway,
// 	WebSocketServer,
// 	// OnGatewayInit,
// 	// OnGatewayConnection,
// 	// OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { PongService } from '../pong.service';
// import { Server, Socket } from 'socket.io';

// import { PongGame } from './../game';
// import { Player } from './../interfaces/player.interface'
// import { Ball } from './../interfaces/ball.interface';
// import { End } from './../interfaces/end.interface';

// interface WaitingList {
// 	player_id: number; 
// 	socket_id: string
// }

// @WebSocketGateway({
// 	cors: {
// 		origin: 'http://localhost:8080', // allow only from our frontend
// 	},
// })
// export class PongGateway {
// 	@WebSocketServer()
// 	server: Server;

// 	match: Map<number, [p1: string, p2: string]>;


// 	private pongGame: PongGame = new PongGame();
// 	private ball: Ball = this.pongGame.ball;
// 	private player1: Player = this.pongGame.player1;
// 	private player2: Player = this.pongGame.player2;
// 	private end: End = this.pongGame.end;
// 	private socket_id: string;

// 	private waitingList: WaitingList[] = [];
// 	private start: boolean = false;
// 	constructor(

// 		private readonly pongService: PongService,
// 	) {
// 		this.match = new Map<number, [p1: string, p2: string]>();
// 	}

// 	@SubscribeMessage('endGame')
// 	handleEndGame(
// 		@ConnectedSocket() client: Socket): void {
// 		// this.pongService.resetGame()
// 		this.start = false;
// 		// console.log('Game has ended')
// 	}

// 	@SubscribeMessage('moveLeft')
// 	handleMoveLeft(
// 		@ConnectedSocket() client: Socket,
// 		@MessageBody() data: any): void {
// 		this.pongService.handleMoveLeft(client, data)
// 		// this.server.emit('state', data);
// 	}

// 	@SubscribeMessage('moveRight')
// 	handleMoveRight(
// 		@ConnectedSocket() client: Socket,
// 		@MessageBody() data: any): void {
// 		this.pongService.handleMoveRight(client, data)
// 		// this.server.emit('state', data);
// 	}

// 	generateMatchId(): number {
// 		let id = 1;
// 		if (this.match.size === 0)
// 			return (id)
// 		while (id > 0) {
// 			if (this.match.has(id))
// 				id++
// 			else
// 				return (id)
// 		}
// 	}

// 	findMatchByPlayer(disconnectedId: string): number {
// 		console.log(disconnectedId)
// 		for (const [id, [p1, p2]] of this.match.entries()) {
// 			if (p1 === disconnectedId || p2 === disconnectedId) {
// 				return (id);
// 			}
// 		}
// 		return (0);
// 	}

// 	@SubscribeMessage('joinMatchmaking')
// 	handleMatchmaking(
// 		@ConnectedSocket() client: Socket,
// 		@MessageBody() { player_id, socket_id }: { player_id: number; socket_id: string }): void {

// 		const playerInfo = {
// 			player_id: player_id,
// 			socket_id: socket_id
// 		};

// 		if (!this.waitingList.some((player) => player.socket_id === socket_id)) {
// 			this.waitingList.push(playerInfo);
// 			console.log('added', player_id, socket_id, 'to waitinglist');
// 		} else {
// 			console.log(socket_id, 'is already in the waiting list');
// 		}
// 		console.log('Waiting list:', this.waitingList);

// 		let matchId = '';
// 		if (this.waitingList.length > 1) {
// 			console.log('two people in waiting list');
// 			const p1 = this.waitingList.pop() // shift
// 			const p2 = this.waitingList.pop()

// 			// matchId = this.generateMatchId();
// 			matchId = (p1.socket_id + p2.socket_id)
// 			console.log(matchId);
// 			client.join(matchId)
// 			// this.match.set(matchId, [p1.socket_id, p2.socket_id]);
// 			// this.start = true;
// 			this.server.to(matchId).emit('startMatch', { p1, p2 });
// 			// this.pongService.resetGame()
// 		}


// 		// const gameInterval = setInterval(() => {
// 		// 	// if (this.end.end) {
// 		// 	//   clearInterval(gameInterval);
// 		// 	//   return;
// 		// 	// }
			
// 		// 	this.pongGame.updateGame(this.ball);
	  
// 			this.server.to(matchId).emit('match', {
// 		// 		ball: this.ball,
// 		// 		player1: this.player1.new,
// 		// 		player2: this.player2.new,
// 		// 		socket_id: this.socket_id,
// 		// 		score1: this.player1.score,
// 		// 		score2: this.player2.score,
// 			});
// 		// }, 1000 / 60);

// 		this.start = true;
// 		this.pongService.resetGame();

// 	}

// 	// afterInit(@ConnectedSocket() client: Socket): void {
// 	// 	// if (this.start)
// 	// 	console.log(this.start)
// 	// 	setInterval(() => this.pongService.tick(client), 1000 / 60);
// 	// }

// 	handleDisconnect(client: Socket): void {
// 		const disconnectedId = client.id
// 		const index = this.waitingList.findIndex(player => player.socket_id === disconnectedId);
// 		console.log('player', disconnectedId, 'left the waiting list');
// 		if (index !== -1) {
// 			this.waitingList.splice(index, 1);
// 		}

// 		//search for the disconnected player in the map
// 		let otherPlayerSocketId: string;
// 		let matchIdToDelete: number;
// 		for (const [matchId, [p1, p2]] of this.match) {
// 			if (p1 === disconnectedId) {
// 				otherPlayerSocketId = p2;
// 				matchIdToDelete = matchId;
// 				break;
// 			}
// 			if (p2 === disconnectedId) {
// 				otherPlayerSocketId = p1;
// 				matchIdToDelete = matchId;
// 				break;
// 			}
// 		}
// 		console.log(client);
// 		// if (otherPlayerSocketId && connectedPlayer.hasOwnProperty(otherPlayerSocketId)) {
// 		// 	console.log('Other player socket_id:', otherPlayerSocketId);
// 		// 	connectedPlayer[otherPlayerSocketId].disconnect(true);
// 		// } else {
// 		// 	console.log('Other player not found');
// 		// }
// 		// if (matchIdToDelete)
// 		// 	match.delete(matchIdToDelete);

// 		// console.log('Waiting list:', this.waitingList);
// 		// this.start = false;
// 		this.server.emit('playerDisconnected', { id: disconnectedId });
// 	}
// }



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

import { PongGame } from './../game';
import { Player } from './../interfaces/player.interface'
import { Ball } from './../interfaces/ball.interface';
import { End } from './../interfaces/end.interface';

interface WaitingList {
	player_id: number; 
	socket_id: string;
	client_id: Socket;
}

interface matchList {
	match_id: string;
	p1_socket_id: string;
	p2_socket_id: string;
}

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})
export class PongGateway {
	@WebSocketServer()
	server: Server;

	private pongGame: PongGame = new PongGame();
	private ball: Ball = this.pongGame.ball;
	private player1: Player = this.pongGame.player1;
	private player2: Player = this.pongGame.player2;
	private end: End = this.pongGame.end;
	private socket_id: string;

	private waitingList: WaitingList[] = [];
	private matchList: matchList[] = [];
	private matchId: string;

	private start: boolean = false;
	constructor(
		private readonly pongService: PongService
	){}

	@SubscribeMessage('endGame')
	handleEndGame(
		@ConnectedSocket() client: Socket): void {
		// this.pongService.resetGame()
		this.start = false;
		// console.log('Game has ended')
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

	// generateMatchId(): number {
	// 	let id = 1;
	// 	if (this.match.size === 0)
	// 		return (id)
	// 	while (id > 0) {
	// 		if (this.match.has(id))
	// 			id++
	// 		else
	// 			return (id)
	// 	}
	// }

	// findMatchByPlayer(disconnectedId: string): number {
	// 	console.log(disconnectedId)
	// 	for (const [id, [p1, p2]] of this.match.entries()) {
	// 		if (p1 === disconnectedId || p2 === disconnectedId) {
	// 			return (id);
	// 		}
	// 	}
	// 	return (0);
	// }

	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, socket_id}: { player_id: number; socket_id: string }): void {
		
		const playerInfo = {
			player_id: player_id,
			socket_id: socket_id,
			client_id: client
		};
		
		if (!this.waitingList.some((player) => player.socket_id === socket_id)) {
			this.waitingList.push(playerInfo);
			console.log('added', player_id, socket_id, 'to waitinglist');
		} else {
			console.log(socket_id, 'is already in the waiting list');
		}
		// console.log('Waiting list:', this.waitingList);
	
		if (this.waitingList.length >= 2){
			console.log('two people in waiting list');
			const p2 = this.waitingList.shift()
			const p1 = this.waitingList.shift()

			// const matchId = this.generateMatchId();
			this.matchId = `${p1.socket_id}-${p2.socket_id}`;

			// match.set(matchId, [p1, p2]);
			const matchInfo = {
				match_id: this.matchId,
				p1_socket_id: p1.socket_id,
				p2_socket_id: p2.socket_id,
			};
			this.matchList.push(matchInfo);
				// this.start = true
			p1.client_id.join(this.matchId)
			p2.client_id.join(this.matchId)
			// client.join(matchId);
			console.log("MATCH ID:", this.matchId)
			this.server.to(this.matchId).emit('startMatch', { p1: { player_id: p1.player_id, socket_id: p1.socket_id }, p2: { player_id: p2.player_id, socket_id: p2.socket_id } });

		}
	}

	async tick(client: Socket): Promise<void> {
		for (const matchId in this.matchList)
			console.log("INFO", matchId)
			this.pongService.tick(client, "hoi", "holla");
	}
	// @SubscribeMessage('joinMatchmaking')
	// handleMatchmaking(
	// 	@ConnectedSocket() client: Socket,
	// 	@MessageBody() { player_id, socket_id }: { player_id: number; socket_id: string }): void {

	// 	const playerInfo = {
	// 		player_id: player_id,
	// 		socket_id: socket_id
	// 	};

	// 	if (!this.waitingList.some((player) => player.socket_id === socket_id)) {
	// 		this.waitingList.push(playerInfo);
	// 		console.log('added', player_id, socket_id, 'to waitinglist');
	// 	} else {
	// 		console.log(socket_id, 'is already in the waiting list');
	// 	}
	// 	console.log('Waiting list:', this.waitingList);

	// 	if (this.waitingList.length > 1) {
	// 		console.log('two or more people in waiting list');

	// 		const p1 = this.waitingList.pop()
	// 		const p2 = this.waitingList.pop()

	// 		// matchId = this.generateMatchId();
	// 		// const matchId = `${p1.socket_id}-${p2.socket_id}`;
	// 		// console.log("MATCH ID:", matchId);

	// 		// this.match.set(matchId, [p1.socket_id, p2.socket_id]);
	// 			// this.start = true

	// 		// client.join(matchId);
	// 		client.emit('startMatch', { p1, p2 });
	// 		// client.to(p2.socket_id).emit('startMatch', { p1, p2 });
	// 		// console.log(`Match ${matchId} started between players ${p1.player_id} and ${p2.player_id}`);
	// 		// this.pongService.resetGame()
		// }


		// const gameInterval = setInterval(() => {
		// 	// if (this.end.end) {
		// 	//   clearInterval(gameInterval);
		// 	//   return;
		// 	// }
			
		// 	this.pongGame.updateGame(this.ball);
	  
			// this.server.to(matchId).emit('match', {
		// 		ball: this.ball,
		// 		player1: this.player1.new,
		// 		player2: this.player2.new,
		// 		socket_id: this.socket_id,
		// 		score1: this.player1.score,
		// 		score2: this.player2.score,
			// });
		// }, 1000 / 60);

		// this.start = true;
		// this.pongService.resetGame();

	// }



	afterInit(@ConnectedSocket() client: Socket): void {
			setInterval(() => this.tick(client), 1000 / 60);
	}

	handleDisconnect(client: Socket): void {
		const disconnectedId = client.id
		// const index = this.waitingList.indexOf(disconnectedId);
		const index = this.waitingList.findIndex(player => player.socket_id === disconnectedId);
		console.log('player', disconnectedId, 'left the waiting list');
		if (index !== -1) {
			this.waitingList.splice(index, 1);
		}

		//search for the disconnected player in the map
		// let otherPlayerSocketId: string;
		// let matchIdToDelete: number;
		// for (const [matchId, [p1, p2]] of this.match) {
		// 	if (p1 === disconnectedId) {
		// 		otherPlayerSocketId = p2;
		// 		matchIdToDelete = matchId;
		// 		break;
		// 	}
		// 	if (p2 === disconnectedId) {
		// 		otherPlayerSocketId = p1;
		// 		matchIdToDelete = matchId;
		// 		break;
		// 	}
		// }
		// if (otherPlayerSocketId && connectedPlayer.hasOwnProperty(otherPlayerSocketId)) {
		// 	console.log('Other player socket_id:', otherPlayerSocketId);
		// 	connectedPlayer[otherPlayerSocketId].disconnect(true);
		// } else {
		// 	console.log('Other player not found');
		// }
		// if (matchIdToDelete)
		// 	match.delete(matchIdToDelete);

		console.log('Waiting list:', this.waitingList);
		// this.start = false;
		this.server.emit('playerDisconnected', { id: disconnectedId });
	}
}