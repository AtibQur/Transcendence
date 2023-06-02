export class CreateMatchDto {
    player_id: number;
    opponent_id: number;
    player_points?: number;
    opponent_points?: number;
    timestamp?: Date;
}