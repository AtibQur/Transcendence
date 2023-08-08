import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';

@Controller('channel')
@UseGuards(AuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // CREATE NEW CHANNEL
  // returns channel id on success, nothing on error
  @Post('create')
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  // CREATE NEW CHANNEL
  // returns channel id on success, nothing on error
  @Post('create/:player_id/:friend_id')
  createDm(@Param('player_id') player_id: string, @Param('friend_id') friend_id: string) {
    return this.channelService.createDm(+player_id, +friend_id);
  }

  // GET ALL PUBLIC & PROTECTED CHANNELS
 // returns all public & protects channels for which a player is not channelmember
  @Get('all/:player_id')
  findAllJoinableChannels(@Param('player_id') player_id: string) {
    return this.channelService.findAllJoinableChannels(+player_id);
  }

  // GET CHANNEL INFO
  // returns channel info (name, is_private, owner_id), nothing on error
  @Get(':channel_id')
  findOneChannel(@Param('channel_id') channel_id: string) {
    return this.channelService.findOneChannel(+channel_id);
  }

  // CHECK IF CHANNEL IS PROTECTED
  // returns true is password is set, otherwise it returns false
  @Get('protect/:channel_id')
  isProtected(@Param('channel_id') channel_id: string) {
    return this.channelService.isProtected(+channel_id);
  }

  // FIND DM
  //returns dm on succes, nothing on error
  @Get('dm/info/:player_id/:friend_id')
  findDm(@Param('player_id') player_id: string, @Param('friend_id') friend_id: string) {
    return this.channelService.findDm(+player_id, +friend_id);
  }

  // CHECK IF CHANNEL IS A DM
  //returns true on succes, nothing on error
  @Get('dm/:channel_id')
  isDm(@Param('channel_id') channel_id: string) {
    return this.channelService.isDm(+channel_id);
  }

  // CHECK IF DM OF PLAYER AND FRIEND ALREADY EXISTS
  //returns true if it exists, otherwise false
  @Get('dm/:player_id/:friend_id')
  isExistingDm(@Param('player_id') player_id: string, @Param('friend_id') friend_id: string) {
    return this.channelService.isExistingDm(+player_id, +friend_id);
  }

  // GET OWNER ID OF CHANNEL
  @Get('owner/:channel_id')
  findChannelOwnerId(@Param('channel_id') channel_id: string) {
    return this.channelService.findOwnerId(+channel_id);
  }

  // ADD PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Post('protect/add/:channel_id/:player_id')
  setPassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }

  // COMPARES GIVEN PASSWORD WITH PASSWORD OF CHANNEL
  // returns true if they match, otherwise false
  // !!!!!!!!!!!! IS IT OKAY TO PASS PASSWORD AS QUERY???/
  @Get('protect/valid/:channel_id')
  validatePassword(@Param('channel_id') channel_id: string, @Query('password') password: string) {
    return this.channelService.validatePassword(+channel_id, password);
  }

  // CHANGE PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Patch('protect/change/:channel_id/:player_id')
  changePassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }

  // REMOVE PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Patch('protect/remove/:channel_id/:player_id')
  removePassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }

  @Delete('delete/:player_id')
  remove(@Body() deleteChannelDto: DeleteChannelDto) {
    return this.channelService.remove(deleteChannelDto);
  }
}
