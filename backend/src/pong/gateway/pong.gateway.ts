import {
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { PongService } from '../pong.service';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { PongGame } from './../game';
import { Game } from '../interfaces/state.interface';
import { PlayerService } from '../../player/player.service';

@WebSocketGateway({
    cors: {
		origin: process.env.HOST_COMPUTER + ':8080', // allow only from our frontend
	},
})
export class PongGateway {
	@WebSocketServer()
	server: Server;

	private readonly playerService = new PlayerService();
	private pongGame: PongGame = new PongGame();
	private game: Game = this.pongGame.game;

	constructor(
		private readonly pongService: PongService
	){}
	
	@SubscribeMessage('inviteAccepted')
	inviteAccepted(
		@ConnectedSocket() client: Socket,
		@MessageBody() player_id: number): void {
			this.pongService.inviteAccepted(client, player_id);
	}

	@SubscribeMessage('acceptInvite')
	handleAccept(
		@ConnectedSocket() client: Socket,
		@MessageBody() {p1_id, p1_socket_id, p2_id, p2_socket_id}: {p1_id: number, p1_socket_id: string
			p2_id: number, p2_socket_id: string}): void {
		this.pongService.handleAcceptInvite(client, p1_id, p1_socket_id, p2_id, p2_socket_id)
	}

	@SubscribeMessage('declineInvite')
	handleDecline(
		@ConnectedSocket() client: Socket,
		@MessageBody() player1_id: number): void {
		this.pongService.handleDeclineInvite(client, player1_id)
	}

	@SubscribeMessage('joinInvite')
	async handleJoinInvite(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, opponent_id, socket_id}: { player_id: number; opponent_id: number; socket_id: string }) {
			this.pongService.handleInvite(client, player_id, opponent_id, socket_id);	
	}

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
		// this.server.emit('state', data);
	}

	@SubscribeMessage('soloMatchStarted')
	handleSoloMatch(
		@ConnectedSocket() client: Socket,
		@MessageBody() {}): void {
			this.pongService.handleSoloMatch(client);
	}
	
	@SubscribeMessage('joinMatchmaking')
	handleMatchmaking(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, socket_id}: { player_id: number; socket_id: string }): void {
			this.pongService.handleJoinMatchmaking(client, player_id, socket_id);
		}

	afterInit(@ConnectedSocket() client: Socket): void {
			setInterval(() => this.pongService.tick(client), 1000 / 60);
	}

	handleDisconnect(client: Socket): void {
		this.pongService.handleDisconnect(client);
	}
}