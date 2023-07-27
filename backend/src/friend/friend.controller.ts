import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // ADD OTHER PLAYER AS FRIEND
  // returns created friend, nothing on failure
  @Post('add/:id')
  addFriend(@Param('id') id: string, @Body() addFriendDto: AddFriendDto) {
    return this.friendService.addFriend(+id, addFriendDto);
  }

  // GET A PLAYERS FRIENDS (CAN PROBABLY BE DELETED!!)
  // returns friend list, or nothing on failure
  @Get(':id')
  findFriends(@Param('id') id: string) {
    return this.friendService.findFriends(+id);
  }

  // FIND FRIENDS USERNAME AND STATUS
  // returns friend list, or nothing on failure
  @Get('username/:id')
  findFriendsUsername(@Param('id') id: string) {
    return this.friendService.findFriendsUsername(+id);
  }

  // DELETE A FRIENDSHIP
  // returns deleted friend, nothing on failure
  @Delete(':id')
  remove(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.remove(+id, updateFriendDto);
  }

  // CHECK IF FRIENDSHIP EXISTS
  // returns true or false
  @Get('exists/:id/:friendId')
  isExistingPlayer(@Param('id') id: string, @Param('friendId') friendId: string) {
    return this.friendService.isExistingFriendship(+id, +friendId);
  }

  // CHECK IF FRIENDSHIP EXISTS
  // returns true or false
  @Get('id/:id/:friendId')
  findFriendshipId(@Param('id') id: string, @Param('friendId') friendId: string) {
    return this.friendService.findFriendshipId(+id, +friendId);
  }
}