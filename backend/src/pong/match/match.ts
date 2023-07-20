import { Player } from "src/player/entities/player.entity";

export class Match {
	static counter = 0;
    private readonly _id: number;
	private readonly _player1: Player;
    private readonly _player2: Player;
	private _score1: number;
	private _score2: number;
    constructor(player1: Player, player2: Player) {
		this._id = Match.counter++;
        this._player1 = player1;
        this._player2 = player2;
		this._score1 = 0;
		this._score2 = 0;
    }

	get score1(): number {
		return (this._score1)
	}

	get score2(): number {
		return (this._score2)
	}

	get player1(): Player {
		return (this._player1)
	}

	get player2(): Player {
		return (this._player2)
	}

	get id(): number {
		return (this._id)
	}

	updateScore(score1: number, score2: number){
		this._score1 = score1;
		this._score2 = score2;
	}
}