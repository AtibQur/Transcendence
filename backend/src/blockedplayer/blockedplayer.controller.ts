import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { BlockedplayerService } from './blockedplayer.service';
import { CreateBlockedplayerDto } from './dto/create-blockedplayer.dto';
import { DeleteBlockedplayerDto } from './dto/delete-blockedplayer.dto';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';

@Controller('blockedplayer')
@UseGuards(AuthGuard)
export class BlockedplayerController {
  constructor(private readonly blockedplayerService: BlockedplayerService) {}

  // BLOCK A PLAYER
  // returns blocked player on success, nothing on failure
  @Post('/add/:id')
  createBlockedplayer(@Param('id') id: string, @Body() createBlockedplayerDto: CreateBlockedplayerDto) {
    return this.blockedplayerService.createBlockedplayer(+id, createBlockedplayerDto);
  }

  // FIND BLOCKED PLAYERS USERNAMES
  // returns the players blocked by 'id', or nothing on failure
  @Get('username/:id')
  findBlockedUsername(@Param('id') id: string) {
    return this.blockedplayerService.findBlockedUsername(+id);
  }

  //FIND IF USER BLOCKED A PLAYER
  // returns true if player is blocked, or false on failure
  @Get('player/:id')
  findIfBlocked(@Param('id') id: string, @Query('username') username: string) {
    return this.blockedplayerService.isBlocked(+id, username);
  }

  // UNBLOCK A PLAYER
  // returns unblocked player on success, nothing on failure
  @Delete('/delete/:id')
  unblockPlayer(@Param('id') id: string, @Body() deleteBlockedplayerDto: DeleteBlockedplayerDto) {
    return this.blockedplayerService.unblockPlayer(+id, deleteBlockedplayerDto);
  }

}
