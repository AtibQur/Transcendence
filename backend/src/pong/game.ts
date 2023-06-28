import { Player } from './interfaces/player.interface';
import { Ball } from './interfaces/ball.interface';
import { End } from './interfaces/end.interface';

export class PongGame {
	private canvasWidth = 858;
	private canvasHeight = 525;
	private _player1: Player = {
		x: 80,
		y: 120,
		score: 0,
		new: 0,
	};
	private _player2: Player = {
		x: 80,
		y: 120,
		score: 0,
		new: 0,
	};
	private _ball: Ball = {
		x: 422,
		y: 251,
		radius: 10,
		dX: 1,
		dY: 1,
		velocity: 1,
	};
	private _end: End = {
		gameEnd: false,
	};

	get ball(): Ball {
		return this._ball;
	}
	get player1(): Player {
		return (this._player1);
	}
	get player2(): Player {
		return (this._player2);
	}
	get end(): End {
		return (this._end);
	}
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
	resetBall() {
		this.ball.x = 422;
		this.ball.y = 251;
		this.ball.velocity = 2;
		this.ball.dX = Math.random() > 0.5 ? 1 : - 1;
		this.ball.dY = Math.random() > 0.5 ? 1 : - 1;
		// this.ball.y = (Math.random() * this.canvasHeight);
		this.ball.y = Math.min(Math.max((Math.random() * this.canvasHeight), 100), this.canvasHeight - 100);
	}
	canvasCollision(){
		if (this.ball.x + this.ball.radius > this.canvasWidth - 10 || this.ball.x < 0) {
			this.ball.dX =- this.ball.dX;
		}
		if (this.ball.y + this.ball.radius > this.canvasHeight - 10 || this.ball.y < 0) {
			this.ball.dY =- this.ball.dY;
		}
		if (this.ball.x < 0){
			this.player2.score++;
			this.resetBall();
		}
		if (this.ball.x + this.ball.radius > 848){
			this.player1.score++;
			this.resetBall();
		}
	}
	paddleCollision(){
		const paddleTop = this.player1.y - 40;
		const paddleBottom = this.player1.y + 40;
		const ballCenter = this.ball.y + (this.ball.radius / 2);
		if (this.ball.x < 20 && this.ball.x > 15 && ballCenter >= paddleTop && ballCenter <= paddleBottom) {
			this.ball.dX =- this.ball.dX;
			this.ball.velocity += 0.01;
		}
		if (this.ball.x < this.canvasWidth - 20 && this.ball.x > this.canvasWidth - 40 && ballCenter >= this.player2.y - 40 && ballCenter <= this.player2.y + 40) {
			this.ball.dX =- this.ball.dX;
			this.ball.velocity += 0.01;
		}
	}
	moveBall(ball): typeof ball {
		this.ball.x += this.ball.dX * this.ball.velocity;
		this.ball.y += this.ball.dY * this.ball.velocity;
		this.player2.y = this.player2.new;
		this.player1.y = this.player1.new;
		this.canvasCollision();
		this.paddleCollision();
	}
	updateGame(ball) {
		for (let i = 0; i < this.ball.velocity; i++)
			this.moveBall(ball);
		if (this.player1.score === 5 || this.player2.score === 5)
			this.end.gameEnd = true;
		// this.paddleMovement(player1)
		// this.checkPaddleCollision();
		// this.checkScore();
	}
}