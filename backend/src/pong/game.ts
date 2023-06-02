import { Ball } from './interfaces/ball.interface';
import { Player } from './interfaces/player.interface';

export class pongGame {
		private canvasWidth = 858;
		private canvasHeight = 525;
		private player1: Player = {
			x: 80,
			y: 80,
			score: 0,
		};
		private player2: Player = {
			x: 80,
			y: 80,
			score: 0,
		};
		private ball: Ball = {
			x: 0,
			y: 0,
			dirX: 1,
			dirY: 1
		};

	// checkPaddleCollision() {
	// 	const paddleTop = this.player1.y - 40;
	// 	const paddleBottom = this.player1.y + 40;
	// 	const ballCenter = this.ball.y + (this.ball.radius / 2);
	// 	if (this.ball.x < 15 && this.ball.x > 10 && ballCenter >= paddleTop && ballCenter <= paddleBottom) {
	// 		this.ball.velocity += 0.5;
	// 		this.ball.dirX =- this.ball.dirX;
	// 	}
	// 	if (this.ball.x < this.canvasWidth - 10 && this.ball.x > this.canvasWidth - 30 && ballCenter >= this.player1.y - 40 && ballCenter <= this.player1.y + 40) {
	// 		this.ball.velocity += 0.5;
	// 		this.ball.dirX =- this.ball.dirX;
	// 	}
	// };
	// resetBall() {
	// 	this.ball.x = this.canvasWidth / 2;
	// 	this.ball.y = this.canvasHeight / 2;
	// }
	// checkScore() {
	// 	if (this.ball.x < 0){
	// 		this.player1.score++;
	// 	}
	// 	if (this.ball.x + this.ball.radius > this.canvasWidth - 10){
	// 		this.player2.score++;
	// 	}
	// 	this.resetBall();
	// };
	moveBall() {
		this.ball.x += this.ball.dirX * this.ball.speed;
		this.ball.y += this.ball.dirY * this.ball.speed;
	}

	updateGame() {
		this.moveBall();
		
		// this.checkPaddleCollision();
		// this.checkScore();
	}
}