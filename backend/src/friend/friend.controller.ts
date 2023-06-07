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

  @Get()
  findAll() {
    return this.friendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }
}
