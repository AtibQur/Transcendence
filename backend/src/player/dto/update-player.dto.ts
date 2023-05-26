import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { PlayerStatus } from '@prisma/client';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
    username?: string;
    wins?: number;
    losses?: number;
    ladder_level?: number;
    achievements?: string[];
    status?: PlayerStatus;
}
