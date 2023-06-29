// import { Injectable } from '@nestjs/common';
import { Ball } from './interfaces/ball.interface';
import { pongGame } from './game';
import { Server, Socket } from 'socket.io';


// @Injectable()
export class PongService {
	private pongGame: pongGame = new pongGame();
	private ball: Ball = this.pongGame.ball;
	
	constructor(private socketServer: Server) {}
	
	moveBall(){
		this.ball.x += this.ball.dirX * this.ball.speed;
		this.ball.y += this.ball.dirY * this.ball.speed;
		this.socketServer.emit('soloGame', this.ball);
	}
	loop = () => {
		for (let i = 0; i < this.ball.speed; i++)
			this.moveBall();
			requestAnimationFrame(this.loop);
		}
	updateGame() {
		this.loop();
		// requestAnimationFrame(this.loop);
		// this.checkPaddleCollision();
		// this.checkScore();
	}
}