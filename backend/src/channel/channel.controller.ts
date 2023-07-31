import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // CREATE NEW CHANNEL
  // returns channel id on success, nothing on error
  @Post('create')
  @UseGuards(AuthGuard)
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  // GET CHANNEL INFO
  // returns channel info (name, is_private, owner_id), nothing on error
  @Get(':channel_id')
  @UseGuards(AuthGuard)
  findOneChannel(@Param('channel_id') channel_id: string) {
    return this.channelService.findOneChannel(+channel_id);
  }

  // CHECK IF CHANNEL IS PROTECTED
  // returns true is password is set, otherwise it returns false
  @Get('protect/:channel_id')
  @UseGuards(AuthGuard)
  isProtected(@Param('channel_id') channel_id: string) {
    return this.channelService.isProtected(+channel_id);
  }

  // CHECK IF CHANNEL IS A DM
  //returns true on succes, nothing on error
  @Get('dm/:channel_id')
  @UseGuards(AuthGuard)
  isDm(@Param('channel_id') channel_id: string) {
    return this.channelService.isDm(+channel_id);
  }

  // CHECK IF DM OF PLAYER AND FRIEND ALREADY EXISTS
  //returns true if it exists, otherwise false
  @Get('dm/:player_id/:friend_id')
  @UseGuards(AuthGuard)
  isExistingDm(@Param('player_id') player_id: string, @Param('friend_id') friend_id: string) {
    return this.channelService.isExistingDm(+player_id, +friend_id);
  }

  @Get('owner/:channel_id')
  @UseGuards(AuthGuard)
  findChannelOwnerId(@Param('channel_id') channel_id: string) {
    return this.channelService.findOwnerId(+channel_id);
  }

  // ADD PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Post('protect/add/:channel_id/:player_id')
  @UseGuards(AuthGuard)
  setPassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }
  
  // CHANGE PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Patch('protect/change/:channel_id/:player_id')
  @UseGuards(AuthGuard)
  changePassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }

  // REMOVE PASSWORD FOR CHANNEL
  // returns channel on success, otherwise null
  @Patch('protect/remove/:channel_id/:player_id')
  @UseGuards(AuthGuard)
  removePassword(@Param('channel_id') channel_id: string, @Param('player_id') player_id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.setPassword(+channel_id, +player_id, updateChannelDto);
  }
  

  //TESTING
  @Post('create/dm/:player_id/:friend_id')
  @UseGuards(AuthGuard)
  addDm(@Param('player_id') player_id: string, @Param('friend_id') friend_id: string) {
    return this.channelService.createDm(+player_id, +friend_id);
  }
}
