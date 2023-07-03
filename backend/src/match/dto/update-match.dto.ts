import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
    match_id: number;
    player_points: number;
    opponent_points: number;
}
