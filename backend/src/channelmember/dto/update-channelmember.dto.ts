import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelmemberDto } from './create-channelmember.dto';

export class UpdateChannelmemberDto extends PartialType(CreateChannelmemberDto) {
    channel_id: number;
    member_id: number;
    is_admin?: boolean;
    is_muted?: boolean;
    is_banned?: boolean;
}