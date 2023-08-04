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
import { User } from '../interfaces/user.interface'
import { Ball } from './../interfaces/ball.interface';
import { Game } from '../interfaces/state.interface';
import { Match } from '../match/match';
import { MatchInstance } from '../match/match-instance';
import { PlayerService } from '../../player/player.service';

interface inviteList {
	player_id: number; 
	socket_id: string;
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

	private readonly playerService = new PlayerService();
	private pongGame: PongGame = new PongGame();
	private ball: Ball = this.pongGame.ball;
	private player1: User = this.pongGame.player1;
	private player2: User = this.pongGame.player2;
	private game: Game = this.pongGame.game;
	private socket_id: string;

	private start: boolean = false;
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

	@SubscribeMessage('joinInvite')
	async handleJoinInvite(
		@ConnectedSocket() client: Socket,
		@MessageBody() { player_id, opponent_id, socket_id}: { player_id: number; opponent_id: number; socket_id: string }) {
			this.pongService.handleInvite(client, player_id, opponent_id, socket_id);	
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