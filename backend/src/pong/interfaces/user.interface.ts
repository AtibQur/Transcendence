import { Player } from "src/player/entities/player.entity";

export interface User {
	user: Player;
	x: number;
	y: number;
	new: number;
	score: number;
}