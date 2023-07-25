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

	checkMatchEnding(match: Match): void {
		if (match.score1 === 5 || match.score2 === 5){
			delete this.matchList[match.id]
			console.log("match", match.id, "deleted")
		}
	}

	async tick(client: Socket): Promise<void> {
		for (const matchId in this.matchList) {
			this.matchList[matchId].tick(client)
			this.checkMatchEnding(this.matchList[matchId].getMatchId())
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
