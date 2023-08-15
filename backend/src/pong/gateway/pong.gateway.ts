import {
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { PongService } from '../pong.service';
import { Server, Socket } from 'socket.io';
import { PongGame } from './../game';
import { Game } from '../interfaces/state.interface';

@WebSocketGateway({
    cors: {
		origin: process.env.HOST_COMPUTER + ':8080', // allow only from our frontend
	},
})
export class PongGateway {
	@WebSocketServer()
	server: Server;

	private pongGame: PongGame = new PongGame();
	private game: Game = this.pongGame.game;

	constructor(
		private readonly pongService: PongService
	){}

	@SubscribeMessage('acceptInvite')
	handleAccept(
		@ConnectedSocket() client: Socket,
		@MessageBody() {p1_id, p1_socket_id, p2_id, p2_socket_id}: {p1_id: number, p1_socket_id: string
			p2_id: number, p2_socket_id: string}) {
			const response = this.pongService.handleAcceptInvite(client, p1_id, p1_socket_id, p2_id, p2_socket_id)
			return (response)
	}

	@SubscribeMessage('declineInvite')
	handleDecline(
		@ConnectedSocket() client: Socket,
		@MessageBody() player1_id: number): void {
		this.pongService.handleDeclineInvite(client, player1_id)
	}

	@SubscribeMessage('sendInvite')
	async handleSendInvite(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, opponent_id, socket_id}: { player_id: number; opponent_id: number; socket_id: string }) {
			const response = this.pongService.handleSendInvite(client, player_id, opponent_id, socket_id);
		return response
	}

	// GAME
	@SubscribeMessage('endGame')
	handleEndGame(
		@ConnectedSocket() client: Socket): void {
		this.game.state = 'start';
	}

	@SubscribeMessage('move')
	handleMoveRight(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any): void {
		this.pongService.handleMove(client, data)
	}
	
	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, socket_id}: { player_id: number; socket_id: string }) {
			const response = this.pongService.handleJoinMatchmaking(client, player_id, socket_id);
			return response;
		}

	afterInit(@ConnectedSocket() client: Socket): void {
			setInterval(() => this.pongService.tick(client), 1000 / 60);
	}

	handleDisconnect(client: Socket): void {
		this.pongService.handleDisconnect(client);
	}
}