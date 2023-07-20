import { Injectable} from '@nestjs/common';
import { PongGame } from './game';
import { Server, Socket } from 'socket.io';
import { User } from './interfaces/user.interface'
import { Ball } from './interfaces/ball.interface';
import { Game } from './interfaces/state.interface';
import { Match } from './match/match';
import { MatchInstance } from './match/match-instance';

interface WaitingList {
	player_id: number; 
	socket_id: string;
}

@Injectable()
export class PongService {
	private waitingList: WaitingList[] = [];
	private matchList: { [key: number]: MatchInstance } = {};

	handleMove(client: Socket, data: any) {
		if (!data.socket_match_id)
			return ;
		if (!this.matchList[data.socket_match_id])
			return ;
		this.matchList[data.socket_match_id].handleMove(client, data);
	}

	handleSoloMatch(client: Socket){
		const inSolomatch = this.searchPlayerInMatch(client)
		if (inSolomatch){
			console.log("can't start a solo match, you are already in a match");
			client.emit('alreadyInMatch');
			return ;
		}
	}

	async handleJoinMatchmaking (client: Socket, player_id: number, socket_id: string): Promise<void>{
		const playerInfo = {
			player_id: player_id,
			socket_id: socket_id,
		}
		if (!this.waitingList.some((player) => player.socket_id === socket_id)) {
			this.waitingList.push(playerInfo);
			console.log('added', player_id, socket_id, 'to waitinglist');
		} else {
			console.log(socket_id, 'is already in the waiting list');
		}
		const checkInMatch = this.searchPlayerInMatch(client)
		if (checkInMatch){
			console.log("can't start a match, you are already in a match")
			client.emit('alreadyInMatch', socket_id);
			return ;
		}
		if (this.waitingList.length >= 2){
			console.log('two people in waiting list');
			const p1 = this.waitingList.shift()
			const p2 = this.waitingList.shift()
			if (!p1 || !p2)
				return ;
			this.createMatch(client, p1, p2);
		}
	}

	createMatch(client: Socket, player1: any, player2: any): Match {
		const match = new Match(player1, player2);
		this.matchList[match.id] = new MatchInstance(match);
		this.matchList[match.id].startGame();
		// if (client.id == player1.socket_id)
		// 	client.emit('startMatch', { player1: { player_id: player1.player_id, socket_id: player1.socket_id }, player2: { player_id: player2.player_id, socket_id: player2.socket_id }});
		// else
		console.log("MATCH ID:", match.id)
		client.to(player1.socket_id).emit('startMatch', { 
			player1: { player_id: player1.player_id, socket_id: player1.socket_id }, 
			player2: { player_id: player2.player_id, socket_id: player2.socket_id },
			matchId: match.id,
		});
		client.emit('startMatch', { 
			player1: { player_id: player1.player_id, socket_id: player1.socket_id }, 
			player2: { player_id: player2.player_id, socket_id: player2.socket_id },
			matchId: match.id,
		});
		return match;
	}

	async tick(client: Socket): Promise<void> {
		for (const matchId in this.matchList) {
			this.matchList[matchId].tick(client)
			// checkmatch
		}
	}

	handleDisconnect(client: Socket): void {
		const disconnectedId = client.id;
		console.log("player", client.id, "disconnecetd");
		const index = this.waitingList.findIndex(player => player.socket_id === disconnectedId);
		console.log('player', disconnectedId, 'left the waiting list');
		if (index !== -1) {
			this.waitingList.splice(index, 1);
		}
		const disconnectedMatch = this.searchPlayerInMatch(client)
		console.log("DISCONNECTED ID", disconnectedMatch)
		if (!disconnectedMatch){
			console.log("Error in disconnecting match")
			return ;
		}
		this.matchList[disconnectedMatch].handleDisconnect(client)
		delete this.matchList[disconnectedMatch];
	}

	searchPlayerInMatch(client: Socket): string {
		for (const matchId in this.matchList) {
			if (this.matchList[matchId].getPlayerSocketId(1) === client.id ||
				this.matchList[matchId].getPlayerSocketId(2) === client.id){
			return matchId;
			}
		}
		return (null);
	}
}

	// private pongGame: PongGame = new PongGame();
	// private ball: Ball = this.pongGame.ball;
	// private player1: Player = this.pongGame.player1;
	// private player2: Player = this.pongGame.player2;
	// private end: End = this.pongGame.end;
	// private readonly match: Match;
	// private p1_socket_id: string;
	// private p2_socket_id: string;

	// constructor(match: Match) {
	// 	this.match = match;
	// }
	
	// // moveBall(){
	// // 	this.ball.x += this.ball.dirX * this.ball.speed;
	// // 	this.ball.y += this.ball.dirY * this.ball.speed;
	// // 	this.socketServer.emit('soloGame', this.ball);
	// // }
	// // loop = () => {
	// // 	for (let i = 0; i < this.ball.speed; i++)
	// // 		this.moveBall();
	// // 		requestAnimationFrame(this.loop);
	// // 	}
	// // updateGame() {
	// // 	this.loop();
	// 	// requestAnimationFrame(this.loop);
	// 	// this.checkPaddleCollision();
	// 	// this.checkScore();
	// // }
	// // async handleMatchMaking(id: number){
	// // 	this.waitingList.push(id);
	// // 	console.log('added', id, 'to waitinglist')
	// // 	if (this.waitingList.length > 1){
	// // 		console.log('two people in waiting list');
	// // 		this.startMatch(this.waitingList.pop(), this.waitingList.pop());
	// // 	}
	// // }

	// // handleCreateMatch(client: Socket, p1: string, p2: string){
	// // 	console.log(p1, 'and', p2, 'are in a match');
	// // 	this.socketServer.emit('startMatch', p1, p2);
	// // }

	// // startMatch(player1: number, player2: number){
	// // 	this.socketServer.emit('startMatch', player1, player2);
	// // }

	// resetGame(): void {
	// 	this.end.end = false;
	// 	this.player1.score = 0;
	// 	this.player2.score = 0;
	// }

	// handleMoveLeft(client: Socket, data: any): void {
	// 	this.player1.new = data;
	// 	this.p1_socket_id = client.id;
	// }

	// handleMoveRight(client: Socket, data: any): void {
	// 	this.player2.new = data;
	// 	this.p2_socket_id = client.id;
	// }
	// // tick(client: Socket, p1_socket_id: string, p2_socket_id: string, matchId: string): void {
	// tick(client: Socket): void {
	// 	if (this.end.end)
	// 		return ;

	// 	this.pongGame.updateGame(this.ball);

	// 	client.to(this.p1_socket_id).emit('match', {
	// 		ball: this.ball,
	// 		player1: this.player1.new,
	// 		player2: this.player2.new,
	// 		score1: this.player1.score,
	// 		score2: this.player2.score,
	// 	},
	// 	);
	// 	client.to(this.p2_socket_id).emit('match', {
	// 		ball: this.ball,
	// 		player1: this.player1.new,
	// 		player2: this.player2.new,
	// 		score1: this.player1.score,
	// 		score2: this.player2.score,
	// 	},
	// 	);
	// }
// }

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