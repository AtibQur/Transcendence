import { Injectable} from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match/match';
import { MatchInstance } from './match/match-instance';
import { PlayerService } from '../player/player.service';
import { MatchService } from 'src/match/match.service';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';

// list for players who send out the invite and opponets who received an invite
interface inviteList {
	player_id: number; 
	opponent_id: number;
	socket_id: string;
}

// list for players in queue
interface WaitingList {
	player_id: number; 
	socket_id: string;
}

// list for player who are in a match
interface inMatch {
	p1: number;
	p2: number;
	match_id: number;
}

@Injectable()
export class PongService {
	constructor(
		private readonly matchService: MatchService
	) {}
	private readonly playerService = new PlayerService;
	private inviteList: inviteList[] = [];
	private waitingList: WaitingList[] = [];
	private inMatch: inMatch[] = [];
	private matchList: { [key: number]: MatchInstance } = {};

	// HANDLE ACCEPTING INVITE
	async handleAcceptInvite(client: Socket, p1_id: number, p1_socket_id: string, p2_id: number, p2_socket_id: string){
		if (!this.inviteList || this.inviteList.length === 0){
			return 1;
		}
		const p1 = {
			player_id: p1_id,
			socket_id: p1_socket_id,
		}
		const p2 = {
			player_id: p2_id,
			socket_id: p2_socket_id,
		}
		// CREATE INVITE MATCH
		this.createMatch(client, p1, p2);

		const index = this.inviteList.findIndex(player => player.player_id === p1_id);
		if (index !== -1){
			this.inviteList.splice(index, 1);
		}
		return 0;
	}

	// HANDLE DECLINING INVITE
	handleDeclineInvite(client: Socket, player_id1: number){
		const index = this.inviteList.findIndex(player => player.player_id === player_id1);
		if (index !== -1){
			this.inviteList.splice(index, 1);
		}
	}

	// HANDLE SENDING OUT AN INVITE TO THE PLAYER
	async handleSendInvite(client: Socket, player_id: number, opponent_id: number, socket_id:string) {
		const playerInfo = {
			player_id: player_id,
			opponent_id: opponent_id,
			socket_id: socket_id,
		}
		// can't send an invite when you are in a match
		const checkInMatch = this.searchPlayerInMatch(client)
		if (checkInMatch){
			return 1;
		}
		// can't send an invite to someone who already received an invite
		if (this.inviteList.some((player) => player.opponent_id === opponent_id)) {
			return 6;
		}
		// can't send an invite to someone who is in a match 
		for (const match of this.inMatch){
			if (match.p1 == opponent_id || match.p2 == opponent_id){
				return 3;
			}
		}
		// can't send an invite to someone who already send out an invite
		if (this.inviteList.some((player) => player.player_id === opponent_id)) {
			return 4;
		}
		// can't send an invite when you or the opponent is in the waiting room
		if (this.waitingList.some((player) => player.player_id === player_id)){ return 5 }
		if (this.waitingList.some((player) => player.player_id === opponent_id)){ return 5 }
		// cant sent an invite when you are already inviting someone
		if (!this.inviteList.some((player) => player.player_id === player_id)) {
			this.inviteList.push(playerInfo); // send invite
		} else {
			return 2; // already send out invte
		}
		// can't send an invite to someone who has already been invited
		const Opponent = await this.playerService.findOneIntraUsername(opponent_id);
		client.to(Opponent).emit('sendInvite', {
			player_id: player_id,
			opponent_id: opponent_id,
			socket_id: socket_id
		});
		return (0);
	}


	// CREATE MATCH VIA PLAY PAGE
	async handleJoinMatchmaking (client: Socket, player_id: number, socket_id: string) {
		const playerInfo = {
			player_id: player_id,
			socket_id: socket_id,
		}
		// can't start a match when you are already in a match
		const checkInMatch = this.searchPlayerInMatch(client)
		if (checkInMatch){
			client.emit('alreadyInMatch', socket_id);
			return ;
		}
		// can't start a match when you've invited someone
		if (this.inviteList.some((player) => player.player_id === player_id)) {
			return 1
		}
		if (!this.waitingList.some((player) => player.socket_id === socket_id)) {
			this.waitingList.push(playerInfo); // added to waitinglist
		} else {
			return 2; // already in waiting list
		}
		if (this.waitingList.length >= 2){
			const p1 = this.waitingList.shift()
			const p2 = this.waitingList.shift()
			if (!p1 || !p2)
				return;
			this.createMatch(client, p1, p2);
		}
		return 0
	}

	// CREATE A NEW MATCH INSTANCE
	async createMatch(client: Socket, player1: any, player2: any): Promise<Match> {
		// create match instance
		const match = new Match(player1, player2);
		this.matchList[match.id] = new MatchInstance(match);
		this.matchList[match.id].startGame();

		// add to inMatch list
		const info = {
			p1: player1.player_id,
			p2: player2.player_id,
			match_id: match.id,
		}
		this.inMatch.push(info)

		const newData: CreateMatchDto = {
			player_id: player1.player_id,
			opponent_id: player2.player_id
		}

		const data = await this.matchService.createMatch(newData);
		if (!data)
			return ;

		client.to(player1.socket_id).emit('startMatch', {
			player1: { player_id: player1.player_id, socket_id: player1.socket_id }, 
			player2: { player_id: player2.player_id, socket_id: player2.socket_id },
			matchId: match.id,
			data: data
		});
		client.emit('startMatch', {
			player1: { player_id: player1.player_id, socket_id: player1.socket_id },
			player2: { player_id: player2.player_id, socket_id: player2.socket_id },
			matchId: match.id,
			data: data
		});
		return match;
	}

	checkMatchEnding(match: Match): void {
		if (match.score1 === 10 || match.score2 === 10){
			delete this.matchList[match.id]
			// delte match in InMatch list
			const index = this.inMatch.findIndex(p => p.match_id === match.id)
				if (index !== -1) {
					this.inMatch.splice(index, 1);
			}
		}
	}

	// GAME LOOP
	async tick(client: Socket): Promise<void> {
		for (const matchId in this.matchList) {
			this.matchList[matchId].tick(client)
			this.checkMatchEnding(this.matchList[matchId].getMatchId())
		}
	}

	handleMove(client: Socket, data: any) {
		if (!data.socket_match_id)
			return ;
		if (!this.matchList[data.socket_match_id])
			return ;
		this.matchList[data.socket_match_id].handleMove(client, data);
	}

	// HANDLE DISCONNECTING
	async handleDisconnect(client: Socket) {
		const disconnectedId = client.id;

		// remove the disconnected player from the queue
		const index = this.waitingList.findIndex(player => player.socket_id === disconnectedId);
		if (index !== -1) {
			this.waitingList.splice(index, 1);
		}
		// remove the disconnected player and the opponent from the the list of player who send out an invite
		const index2 = this.inviteList.findIndex(player => player.socket_id === disconnectedId);
		if (index2 !== -1) {
			this.inviteList.splice(index2, 1);
		}
		const playerId = parseInt(client.handshake.auth.id);
		if (playerId){
			const index3 = this.inviteList.findIndex(player => player.opponent_id === playerId);
			if (index3 !== -1) {
				this.inviteList.splice(index3, 1);
			}
			// delete inMatch
			const index4 = this.inMatch.findIndex(p => p.p1 === playerId)
			if (index4 !== -1) {
				this.inMatch.splice(index4, 1);
			}
			// delete inMatchList
			const index5 = this.inMatch.findIndex(p => p.p2 === playerId);
			if (index5 !== -1) {
				this.inMatch.splice(index5, 1);
			}
		}
		const disconnectedMatch = this.searchPlayerInMatch(client)
		if (!disconnectedMatch){
			return ;
		}
		this.matchList[disconnectedMatch].handleDisconnect(client)
		delete this.matchList[disconnectedMatch];
	}

	// SEARCH IF A PLAYER IS IN A MATCH
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
