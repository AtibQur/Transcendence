import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { PlayerStatus } from '@prisma/client';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
    username?: string;
    achieved?: string;
    status?: PlayerStatus;
    two_factor_enabled?: boolean;
}
