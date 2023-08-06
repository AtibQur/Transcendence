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

	async handleConnection(@ConnectedSocket() client: Socket){
		const playerId = parseInt(client.handshake.auth.id);
		if (!playerId)
		{
			console.log('nobody logged in');
			client.disconnect(); 
		}
		else {
			const intra_username = await this.playerService.findOneIntraUsername(playerId);
			console.log('pong logging...');
			client.join(intra_username);
			console.log('client joined the socket pong room')
		}
	}
	// INVITE
	@SubscribeMessage('acceptInvite')
	handleAccept(
		@ConnectedSocket() client: Socket,
			@MessageBody() { player1, player1_socketId, opponent_id, opponent_id_socketId }:
			{ player1: number; player1_socketId: string; opponent_id, number; opponent_id_socketId: string }): void {
			this.pongService.handleAcceptInivite(client, player1, player1_socketId, opponent_id, opponent_id_socketId);	
		}

	@SubscribeMessage('declineInvite')
	handleDecline(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player1}: { player1: number}): void {
		this.pongService.handleDeclineInivite(client, player1);	
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