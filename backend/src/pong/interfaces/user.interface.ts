import { Player } from "src/player/entities/player.entity";

export interface User {
	user: Player;
	y: number;
	height: number;
	new: number;
	score: number;
}