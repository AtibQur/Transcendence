// import { Injectable } from '@nestjs/common';
import { Ball } from './interfaces/ball.interface';
import { PongGame } from './game';
import { Server, Socket } from 'socket.io';
import { Player } from './interfaces/player.interface'


// @Injectable()
export class PongService {
	private waitingList: number[] = [];
	private pongGame: PongGame = new PongGame();
	private ball: Ball = this.pongGame.ball;
	private player2: Player = this.pongGame.player2;
	
	constructor(private socketServer: Socket) {}
	
	// moveBall(){
	// 	this.ball.x += this.ball.dirX * this.ball.speed;
	// 	this.ball.y += this.ball.dirY * this.ball.speed;
	// 	this.socketServer.emit('soloGame', this.ball);
	// }
	// loop = () => {
	// 	for (let i = 0; i < this.ball.speed; i++)
	// 		this.moveBall();
	// 		requestAnimationFrame(this.loop);
	// 	}
	// updateGame() {
	// 	this.loop();
		// requestAnimationFrame(this.loop);
		// this.checkPaddleCollision();
		// this.checkScore();
	// }
	async handleMatchMaking(id: number){
		this.waitingList.push(id);
		console.log('added', id, 'to waitinglist')
		if (this.waitingList.length > 1){
			console.log('two people in waiting list');
			this.startMatch(this.waitingList.pop(), this.waitingList.pop());
		}
	}

	startMatch(player1: number, player2: number){
		this.socketServer.emit('startMatch', player1, player2);
	}

	handleMovement(client: Socket, data: any): void {
		this.player2.new = data;
	}

	tick(client: Socket): void {
		// return;
		this.pongGame.updateGame(this.ball);
		client.emit('match', {
			ball: this.ball,
			player2: this.player2.new,
		},
		);
	}
}
