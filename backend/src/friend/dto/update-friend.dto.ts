import { PartialType } from '@nestjs/mapped-types';
import { AddFriendDto } from './add-friend.dto';

export class UpdateFriendDto extends PartialType(AddFriendDto) {
    friendUsername: string;
}
