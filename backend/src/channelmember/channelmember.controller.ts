import { Controller, Get, Post, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';

@Controller('channelmember')
@UseGuards(AuthGuard)
export class ChannelmemberController {
  constructor(private readonly channelmemberService: ChannelmemberService) {}

  // player_id is always the id of the player who is currently logged in
  // member_id could also be another player you want information on

  // ADD PLAYER TO EXISTING CHANNEL
  // returns created channelmember on success, nothing on error
  @Post('create')
  create(@Body() createChannelmemberDto: CreateChannelmemberDto) {
    return this.channelmemberService.createChannelmember(createChannelmemberDto);
  }

  // FIND ALL CHANNELS WHERE PLAYER IS MEMBER
  // TODO: move to channels module?
  @Get('allchannels/:player_id')
  findAllPlayerChannels(@Param('player_id') player_id: string) {
    return this.channelmemberService.findPlayerChannels(+player_id);
  }

  // FIND ALL CHANNELS WHERE PLAYER IS MEMBER
  // TODO: move to channels module?
  @Get('alldms/:player_id')
  findPlayerDms(@Param('player_id') player_id: string) {
    return this.channelmemberService.findPlayerDms(+player_id);
  }

  // FIND ALL CHANNELMEMBERS OF CHANNEL
  @Get('allmembers/:channel_id')
  findAllChannelmembers(@Param('channel_id') channel_id: string) {
    return this.channelmemberService.findAllChannelmembers(+channel_id);
  }

  // CHECK IF PLAYER IS MEMBER OF CHANNEL
  @Get('channel/:channel_id/:member_id')
  findIsInChannel(@Param('member_id') member_id: string, @Param('channel_id') channel_id: string) {
    return this.channelmemberService.isInChannel(+member_id, +channel_id);
  } 

  // GET A MEMBERS INFO (is_admin, is_muted etc)
  @Get('info/:member_id/:channel_id')
  findChannelMember(@Param('member_id') member_id: string, @Param('channel_id') channel_id: string) {
    return this.channelmemberService.findChannelmember(+member_id, +channel_id);
  }

  // GET A PLAYERS' BLOCK/ADMIN/MUTE/DELETE ANOTHER MEMBER RIGHTS
  @Get('rights/:player_id')
  findRights(@Param('player_id') player_id: string, @Query('member_id') member_id: string, @Query('channel_id') channel_id: string) {
    return this.channelmemberService.findRights(+player_id, +member_id, +channel_id)
  }

  // CHECK IF MEMBER IS ADMIN
  @Get('admin/:member_id/:channel_id')
  findIsAdmin(@Param('member_id') member_id: string, @Param('channel_id') channel_id: string) {
    return this.channelmemberService.findIsAdmin(+member_id, +channel_id);
  }

  // MAKE ANOTHER PLAYER ADMIN
  @Patch('makeadmin/:player_id')
  makeAdmin(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.makeAdmin(+player_id, updateChannelmemberDto);
  }

  // BAN A CHANNELMEMBER
  @Patch('ban/:player_id')
  banMember(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.banMember(+player_id, updateChannelmemberDto, true);
  }

  // UNBAN A CHANNELMEMBER
  @Patch('unban/:player_id')
  unbanMember(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.banMember(+player_id, updateChannelmemberDto, false);
  }

  // MUTE A CHANNELMEMBER
  @Patch('mute/:player_id')
  muteMember(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.muteMember(+player_id, updateChannelmemberDto, true);
  }

  // UNMUTE A CHANNELMEMBER
  @Patch('unmute/:player_id')
  unmuteMember(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.muteMember(+player_id, updateChannelmemberDto, false);
  }

  // DELETE A PLAYER FROM CHANNEL
  @Delete(':player_id')
  remove(@Param('player_id') player_id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.remove(+player_id, updateChannelmemberDto);
  }
}
