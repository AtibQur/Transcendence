import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // CREATE NEW CHANNEL
  // returns channel id on success, nothing on error
  @Post('create')
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  // GET CHANNEL INFO
  // returns channel info (name, is_private, owner_id), nothing on error
  @Get(':channel_id')
  findOneChannel(@Param('channel_id') channel_id: string) {
    return this.channelService.findOneChannel(+channel_id);
  }
  
}
