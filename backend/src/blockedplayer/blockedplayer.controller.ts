import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockedplayerService } from './blockedplayer.service';
import { CreateBlockedplayerDto } from './dto/create-blockedplayer.dto';
import { DeleteBlockedplayerDto } from './dto/delete-blockedplayer.dto';

@Controller('blockedplayer')
export class BlockedplayerController {
  constructor(private readonly blockedplayerService: BlockedplayerService) {}

  // BLOCK A PLAYER
  @Post('/add/:id')
  createBlockedplayer(@Param('id') id: string, @Body() createBlockedplayerDto: CreateBlockedplayerDto) {
    return this.blockedplayerService.createBlockedplayer(+id, createBlockedplayerDto);
  }

  @Get()
  findAll() {
    return this.blockedplayerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockedplayerService.findOne(+id);
  }

  // UNBLOCK A PLAYER
  @Delete('/delete/:id')
  unblockPlayer(@Param('id') id: string, @Body() deleteBlockedplayerDto: DeleteBlockedplayerDto) {
    return this.blockedplayerService.unblockPlayer(+id, deleteBlockedplayerDto);
  }
}
