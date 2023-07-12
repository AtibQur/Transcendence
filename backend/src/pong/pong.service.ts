// import { Injectable } from '@nestjs/common';
import { PongGame } from './game';
import { Server, Socket } from 'socket.io';
import { Player } from './interfaces/player.interface'
import { Ball } from './interfaces/ball.interface';
import { End } from './interfaces/end.interface';


// @Injectable()
export class PongService {
	private pongGame: PongGame = new PongGame();
	private ball: Ball = this.pongGame.ball;
	private player1: Player = this.pongGame.player1;
	private player2: Player = this.pongGame.player2;
	private end: End = this.pongGame.end;
	// private p1_socket_id: string;
	// private p2_socket_id: string;

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
	// async handleMatchMaking(id: number){
	// 	this.waitingList.push(id);
	// 	console.log('added', id, 'to waitinglist')
	// 	if (this.waitingList.length > 1){
	// 		console.log('two people in waiting list');
	// 		this.startMatch(this.waitingList.pop(), this.waitingList.pop());
	// 	}
	// }

	// handleCreateMatch(client: Socket, p1: string, p2: string){
	// 	console.log(p1, 'and', p2, 'are in a match');
	// 	this.socketServer.emit('startMatch', p1, p2);
	// }

	// startMatch(player1: number, player2: number){
	// 	this.socketServer.emit('startMatch', player1, player2);
	// }

	resetGame(): void {
		this.end.end = false;
		this.player1.score = 0;
		this.player2.score = 0;
	}

	handleMoveLeft(client: Socket, data: any): void {
		this.player1.new = data;
		// this.p1_socket_id = client.id;
	}

	handleMoveRight(client: Socket, data: any): void {
		this.player2.new = data;
		// this.p2_socket_id = client.id;
	}

	tick(client: Socket, p1_socket_id: string, p2_socket_id: string): void {
		if (this.end.end)
			return ;

		this.pongGame.updateGame(this.ball);

		client.to(p1_socket_id).emit('match', {
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
		client.to(p2_socket_id).emit('match', {
			ball: this.ball,
			player1: this.player1.new,
			player2: this.player2.new,
			score1: this.player1.score,
			score2: this.player2.score,
		},
		);
	}
}

// fix game ending
// save matches
// fix 

// client.emit('match', {
// 	ball: this.ball,
// 	player1: this.player1.new,
// 	player2: this.player2.new,
// 	socket_id: this.socket_id,
// 	score1: this.player1.score,
// 	score2: this.player2.score,
// },