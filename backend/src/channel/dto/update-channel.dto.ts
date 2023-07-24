import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
    name?: string;
    password?: string;
    is_private?: boolean;
    owner_id?: number;
}
