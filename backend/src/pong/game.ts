import { User } from './interfaces/user.interface';
import { Ball } from './interfaces/ball.interface';
import { Game } from './interfaces/state.interface';
import { PowerUp } from './interfaces/powerUp.interface';

export class PongGame {
	private canvasWidth = 858;
	private canvasHeight = 525;
	private _player1: User = {
		user: null,
		x: 80,
		y: 120,
		score: 0,
		new: 0,
	};
	private _player2: User = {
		user: null,
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
		velocity: 2,
	};
	private _game: Game = {
		state: 'start',
	};
	private _powerUp: PowerUp = {
		type: 0,
		x: 0,
		y: 0,
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
		ball.x = 422;
		ball.y = 251;
		ball.velocity = 2;
		ball.dX = Math.random() > 0.5 ? 1 : - 1;
		ball.dY = Math.random() > 0.5 ? 1 : - 1;
		ball.y = Math.min(Math.max((Math.random() * this.canvasHeight), 100), 
		this.canvasHeight - 100);
	}

	canvasCollision(player1, player2, ball) {
		if (ball.x > this.canvasWidth || ball.x < 0) {
			ball.dX =- ball.dX;
		}
		if (ball.y + this.ball.radius > this.canvasHeight - 20 || ball.y < 0) {
			ball.dY =- ball.dY;
		}
		if (ball.x < 0){
			player2.score++;
			this.resetBall(ball);
		}
		if (ball.x > 843){
			player1.score++;
			this.resetBall(ball);
		}
	}

	paddleCollision(player1, player2, ball) {
		const paddleTop = player1.y - 45;
		const paddleBottom = player1.y + 45;
		const ballCenter = ball.y + (this.ball.radius / 2);
		// Left Paddle
		if (ball.x < 20 && ball.x > 15 && ballCenter >= paddleTop && 
			ballCenter <= paddleBottom) {
			ball.dX =- ball.dX;
			ball.velocity += 0.002;
		}
		// Right Paddle
		if (ball.x < this.canvasWidth - 10 && ball.x > this.canvasWidth - 50 && 
			ballCenter >= player2.y - 45 && ballCenter <= player2.y + 45) {
			ball.dX =- ball.dX;
			ball.velocity += 0.002;
		}
	}

	checkPowerUp(){
		if (this.player1.score == 3){
			this.powerUp.type = 1;
			this.powerUp.x = 422;
			this.powerUp.y = 251;
		}
	}

	moveBall(player1, player2, ball) {
		ball.x += ball.dX * ball.velocity;
		ball.y += ball.dY * ball.velocity;
		player2.y = player2.new;
		player1.y = player1.new;

		this.canvasCollision(player1, player2, ball);
		this.paddleCollision(player1, player2, ball);
	}

	updateGame(player1, player2, ball) {
		for (let i = 0; i < ball.velocity; i++)
			this.moveBall(player1, player2, ball);

		this.checkPowerUp()

		if (player1.score === 10 || player2.score === 10)
			this.game.state = 'end'
	}
}