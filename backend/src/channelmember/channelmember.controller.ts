import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';

@Controller('channelmember')
export class ChannelmemberController {
  constructor(private readonly channelmemberService: ChannelmemberService) {}

  // ADD PLAYER TO EXISTING CHANNEL
  // returns created channelmember on success, nothing on error
  @Post('create')
  create(@Body() createChannelmemberDto: CreateChannelmemberDto) {
    return this.channelmemberService.createChannelmember(createChannelmemberDto);
  }

  // FIND ALL CHANNELS WHERE PLAYER IS MEMBER
  // TODO: move to channels module?
  @Get('allchannels/:id')
  findPlayerChannels(@Param('id') id: string) {
    return this.channelmemberService.findPlayerChannels(+id);
  }

  // FIND ALL CHANNELMEMBERS OF CHANNEL
  @Get('allmembers/:channel_id')
  findAllChannelmembers(@Param('channel_id') channel_id: string) {
    return this.channelmemberService.findAllChannelmembers(+channel_id);
  }

  // CHECK IF MEMBER IS ADMIN
  @Get('admin/:id/:channel_id')
  findIsAdmin(@Param('id') id: string, @Param('channel_id') channel_id: string) {
    return this.channelmemberService.findIsAdmin(+id, +channel_id);
  }

  // DELETE A PLAYER FROM CHANNEL
  // returns deleted channelmember on success, nothing on error
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelmemberService.remove(+id);
  }
}
