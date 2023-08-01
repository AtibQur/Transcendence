import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
    player_points: number;
    opponent_points: number;
}
