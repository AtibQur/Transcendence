import { User } from './interfaces/user.interface';
import { Ball } from './interfaces/ball.interface';
import { Game } from './interfaces/state.interface';
import { PowerUp } from './interfaces/powerUp.interface';

interface resetInfo {
	player1: boolean;
	player2: boolean;
	score1: number;
	score2: number;
	type: number;
}

export class PongGame {
	private isFirstBallMove = true;
	private canvasWidth = 858;
	private canvasHeight = 526;
	private _player1: User = {
		user: null,
		y: 120,
		height: 80,
		score: 0,
		new: 0,
	};
	private _player2: User = {
		user: null,
		y: 120,
		height: 80,
		score: 0,
		new: 0,
	};
	private _ball: Ball = {
		x: 419,
		y: 251,
		radius: 10.5,
		dX: 1,
		dY: 1,
		velocity: 4,
	};
	private _game: Game = {
		state: 'start',
	};
	private _powerUp: PowerUp = {
		type: 0,
		new: true,
		active: false,
		x: 0,
		y: 0,
	};
	private info: resetInfo  = {
		player1: false,
		player2: false,
		score1: 0,
		score2: 0,
		type: 0,
	};

	get powerUp(): PowerUp {
		return (this._powerUp)
	}
	get ball(): Ball {
		return this._ball;
	}
	get player1(): User {
		return (this._player1);
	}
	get player2(): User {
		return (this._player2);
	}
	get game(): Game {
		return (this._game);
	}

	resetBall(ball) {
		ball.x = this.canvasWidth / 2;
		ball.y = this.canvasHeight / 2;
		this.ball.velocity += 0.25;
		ball.dX = Math.random() > 0.5 ? 1 : - 1;
		ball.dY = Math.random() > 0.5 ? 1 : - 1;
		ball.y = Math.min(Math.max((Math.random() * this.canvasHeight), 100), 
		this.canvasHeight - 100);
	}

	canvasCollision(player1, player2, ball) {
		// top and bottom
		if (ball.y + this.ball.radius > this.canvasHeight - 21 || ball.y < 0) {
			ball.dY =- ball.dY;
		}
		if (ball.x < 0){
			player2.score++;
			this.resetBall(ball);
		}
		if (ball.x > 831){
			player1.score++;
			this.resetBall(ball);
		}
	}

	paddleCollision(player1, player2, ball) {
		const paddleTop = player1.y - player1.height / 2;
		const paddleBottom = player1.y + player1.height / 2;
		const paddleTop2 = player2.y - player2.height / 2;
		const paddleBottom2 = player2.y + player2.height / 2;
		const ballCenter = ball.y + (this.ball.radius / 2);
		//left paddle
		// if (ball.x == 15){
		// 	if ((ball.y + 21) > paddleTop && (ball.y) < paddleBottom) {
		// 		ball.dX =- ball.dX;
		// 	}
		// }
		// // right paddle corner
		// if ((ball.x) < 15) {
		// 	if ((ball.y + 21) > paddleTop && (ball.y) < paddleBottom) {
		// 		ball.dY = 0;
		// 	}
		// }


		// // right paddle
		// if ((ball.x + 21) == 833) {
		// 	if ((ball.y + 21) > paddleTop2 && (ball.y) < paddleBottom2) {
		// 		ball.dX =- ball.dX;
		// 	}
		// }
		// // right paddle corner
		// if ((ball.x + 21) > 833) {
		// 	if ((ball.y + 21) > paddleTop2 && (ball.y) < paddleBottom2) {
		// 		ball.dY = 0;
		// 	}
		// }


		// left paddle
		if (ball.x <= 15) {
			if (ball.x == 15){
				if ((ball.y + 21) > paddleTop && (ball.y) < paddleBottom) {
					ball.dX =- ball.dX;
				}
			}
			// left paddle corner
			else {
				if ((ball.y + 21) > paddleTop && (ball.y) < paddleBottom) {
					ball.dY = 0;
				}
			}
		}
		// right paddle
		if ((ball.x + 21) >= 833) {
			if ((ball.x + 21) == 833) {
				if ((ball.y + 21) > paddleTop2 && (ball.y) < paddleBottom2) {
					ball.dX =- ball.dX;
				}
			}
			// right paddle corner
			else {
				if ((ball.y + 21) > paddleTop2 && (ball.y) < paddleBottom2) {
					ball.dY = 0;
				}
			}
		}
	}

	//Power Up
	doPowerUp(ball: any, player1: any, player2: any, powerUp: any){
		if (powerUp.active){
			if (powerUp.type === 1){
				// naar link -1 // naar recht +1
				if (ball.dX > 0) {
					player1.height = 120;
					this.info.score1 = player1.score;
					this.info.player1 = true;
				}
				else {
					player2.height = 120;
					this.info.score2 = player2.score;
					this.info.player2 = true;
				}
				this.info.type = 1;	
			}
		}
	}
	resetPowerUp(player1: any, player2: any){
		if (this.info.player1){
			const totalScore1 = this.info.score1 + 3;
				if (player1.score === totalScore1){
					player1.height = 80;
					this.powerUp.active = false;
					// this.powerUp.new = true;
				}
		}
		if (this.info.player2){
			const totalScore2 = this.info.score2 + 3;
				if (player2.score === totalScore2){
					player2.height = 80;
					this.powerUp.active = false;
					// this.powerUp.new = true;
				}
		}
	}
	setUpPowerUp(){
		// this.powerUp.type = Math.floor(Math.random() * 2) + 1;
		this.powerUp.type = 1;
		this.powerUp.x = Math.floor(Math.random() * 490);
		this.powerUp.y = Math.floor(Math.random() * 615) + 205;
	}
	checkPowerUp(){
		if (this.player1.score === 3){
			if (this.powerUp.new){
				this.setUpPowerUp()
				this.powerUp.new = false;
			}
		}
		// if (this.player1.score == 6){
		// 	if (this.powerUp.new){
		// 		this.setUpPowerUp()
		// 		this.powerUp.new = false;
		// 	}
		// }
	}
	candyPickUp(ball, player1, player2, powerUp: any){
		const powerUpRangeX = this.powerUp.x + 32;
		const powerUpRangeY = this.powerUp.y + 32;
		const ballRangeX = (ball.x + this.ball.radius);
		const ballRangeY = (ball.y + this.ball.radius);
		if (ballRangeX > this.powerUp.y && ballRangeX < powerUpRangeY && 
			ballRangeY > this.powerUp.x && ballRangeY < powerUpRangeX){
				this.powerUp.active = true;
				this.doPowerUp(ball, player1, player2, powerUp)
			}
		}
		
	moveBall(player1, player2, ball) {
		ball.x += ball.dX;
		ball.y += ball.dY;
		player2.y = player2.new;
		player1.y = player1.new;

		this.canvasCollision(player1, player2, ball);
		this.paddleCollision(player1, player2, ball);
		if (!this.powerUp.active)
			this.candyPickUp(ball, player1, player2, this.powerUp);
	}

	updateGame(player1, player2, ball) {
		// wait a couple of seconds before starting game
		if (this.isFirstBallMove) {
			setTimeout(() => {
				this.moveBall(player1, player2, ball);
				this.isFirstBallMove = false; 
			}, 2000); // beginning delay
		} else {
			for (let i = 0; i < this.ball.velocity; i++)
				this.moveBall(player1, player2, ball);
		}
		if (this.powerUp.new)
			this.checkPowerUp();
		if (this.powerUp.active)
			this.resetPowerUp(player1, player2);
	
		if (player1.score === 10 || player2.score === 10)
			this.game.state = 'end';
	}
	// updateGame(player1, player2, ball) {
	// 	for (let i = 0; i < ball.velocity; i++)
	// 		this.moveBall(player1, player2, ball);
		
	// 	if (this.powerUp.new)
	// 		this.checkPowerUp()
	// 	if (this.powerUp.active)
	// 		this.resetPowerUp(player1, player2);

	// 	if (player1.score === 10 || player2.score === 10)
	// 		this.game.state = 'end'
	// }
}