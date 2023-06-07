import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // ADD OTHER PLAYER AS FRIEND
  @Post('add/:id')
  addFriend(@Param('id') id: string, @Body() addFriendDto: AddFriendDto) {
    return this.friendService.addFriend(+id, addFriendDto);
  }

  // GET A PLAYERS FRIENDS
  @Get(':id')
  findFriends(@Param('id') id: string) {
    return this.friendService.findFriends(+id);
  }

  // DELETE A FRIENDSHIP
  @Delete(':id')
  remove(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.remove(+id, updateFriendDto);
  }
}
