import { Player } from "src/player/entities/player.entity";

export class Match {
	static counter = 0;
    private readonly _id: number;
	private readonly _player1: Player;
    private readonly _player2: Player;
    constructor(player1: Player, player2: Player) {
		this._id = Match.counter++;
        this._player1 = player1;
        this._player2 = player2;
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
}