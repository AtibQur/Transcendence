import { Injectable } from '@nestjs/common';
import { PongGame } from '../game';
import { Server, Socket } from 'socket.io';
import { User } from '../interfaces/user.interface'
import { Ball } from '../interfaces/ball.interface';
import { Game } from '../interfaces/state.interface';
import { Match } from '../match/match';

@Injectable()
export class MatchInstance {
	private pongGame: PongGame = new PongGame();
	private readonly match: Match;
	private ball: Ball = this.pongGame.ball;
	private player1: User = this.pongGame.player1;
	private player2: User = this.pongGame.player2;
	private game: Game = this.pongGame.game;

	constructor(match: Match) {
		this.match = match;
	}

	getPlayerSocketId(nb: number): string{
		if (nb == 1)
			return (this.match.player1.socket_id)
		if (nb == 2)
			return (this.match.player2.socket_id)
	}

	startGame(): void {
		this.game.state = 'start';
		this.player1.user = this.match.player1;
		this.player2.user = this.match.player2;
		this.player1.score = 0;
		this.player2.score = 0;
	}

	handleMove(client: Socket, data: any): void {
		if (!client) {
			console.log("no client")
			return ;
		}
		if (client.id == this.player1.user.socket_id){
			this.player1.new = data.move;
		}
		else if (client.id === this.player2.user.socket_id){
			this.player2.new = data.move;
		}
	}

	handleMoveLeft(client: Socket, data: any): void {
		if (!client) {
			console.log("no left movement client")
			return ;
		}
			this.player1.new = data;
	}

	handleMoveRight(client: Socket, data: any): void {
		if (!client) {
			console.log("no right movement client")
			return ;
		}
		this.player2.new = data;
	}

	tick(client: Socket): void {
		if (this.game.state !== 'start')
			return ;

		this.pongGame.updateGame(this.player1, this.player2, this.ball);

		client.to(this.player1.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
		client.to(this.player2.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
	}

	handleDisconnect(client: Socket): void {
		console.log("This match is getting diconnected");
		this.game.state = 'stop'
		if (this.player1.user.socket_id === client.id){
			this.player1.score = 0;
			this.player2.score = 5;
		}
		else if (this.player2.user.socket_id === client.id){
			this.player1.score = 5;
			this.player2.score = 0;
		}
		client.to(this.player1.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
		client.to(this.player2.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
	}
}
