import { Injectable } from '@nestjs/common';
import { PongGame } from '../game';
import { Server, Socket } from 'socket.io';
import { User } from '../interfaces/user.interface'
import { Ball } from '../interfaces/ball.interface';
import { Game } from '../interfaces/state.interface';
import { Match } from '../match/match';
import { PowerUp } from '../interfaces/powerUp.interface';

@Injectable()
export class MatchInstance {
	private pongGame: PongGame = new PongGame();
	private readonly match: Match;
	private ball: Ball = this.pongGame.ball;
	private player1: User = this.pongGame.player1;
	private player2: User = this.pongGame.player2;
	private game: Game = this.pongGame.game;
	private powerUp: PowerUp = this.pongGame.powerUp;

	constructor(match: Match) {
		this.match = match;
	}

	getMatchId() {
		return (this.match)
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
		this.player1.new = 263;
		this.player2.new = 263;
		this.player1.score = 0;
		this.player2.score = 0;
		this.powerUp.type = 0;
		this.powerUp.new = true;
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
		this.match.updateScore(this.player1.score, this.player2.score)

		// console.log("powerup", this.powerUp)
		// this.sendMatchStateUpdate(client);

		client.to(this.player1.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			player1Height: this.player1.height,
			player2Height: this.player2.height,
			score1: this.player1.score,
			score2: this.player2.score,
			powerUp: this.powerUp,
		},
		);
		client.to(this.player2.user.socket_id).emit('match', {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			player1Height: this.player1.height,
			player2Height: this.player2.height,
			score1: this.player1.score,
			score2: this.player2.score,
			powerUp: this.powerUp,
		},
		);
	}

	sendMatchStateUpdate(client: Socket){
		const matchState = {
			state: this.game.state,
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			player1Height: this.player1.height,
			player2Height: this.player2.height,
			score1: this.player1.score,
			score2: this.player2.score,
		};

		client.to(this.player1.user.socket_id).emit('match', matchState);
		client.to(this.player2.user.socket_id).emit('match', matchState);
	}

	handleDisconnect(client: Socket): void {
		console.log("This match is getting diconnected");
		this.game.state = 'stop'
		if (this.player1.user.socket_id === client.id){
			this.player1.score = 0;
			this.player2.score = 10;
		} else if (this.player2.user.socket_id === client.id){
			this.player1.score = 10;
			this.player2.score = 0;
		}

		this.sendMatchStateUpdate(client);
		// client.to(this.player1.user.socket_id).emit('match', {
		// 	state: this.game.state,
		// 	ball: this.ball,
		// 	player1: this.player1.new,
		// 	player2: this.player2.new,
		// 	score1: this.player1.score,
		// 	score2: this.player2.score,
		// },
		// );
		// client.to(this.player2.user.socket_id).emit('match', {
		// 	state: this.game.state,
		// 	ball: this.ball,
		// 	player1: this.player1.new,
		// 	player2: this.player2.new,
		// 	score1: this.player1.score,
		// 	score2: this.player2.score,
		// },
		// );
	}
}
