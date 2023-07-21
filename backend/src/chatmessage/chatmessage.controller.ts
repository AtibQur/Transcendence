import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatmessageService } from './chatmessage.service';
import { CreateChatmessageDto } from './dto/create-chatmessage.dto';

@Controller('chatmessage')
export class ChatmessageController {
  constructor(private readonly chatmessageService: ChatmessageService) {}

  // CREATE NEW CHAT MESSAGE
  @Post('create')
  create(@Body() createChatmessageDto: CreateChatmessageDto) {
    return this.chatmessageService.createChatMessage(createChatmessageDto);
  }

  // GET ALL CHAT MESSAGES WITHIN ONE CHANNEL
//   @Get(':channel_id')
//   findChannelMsgs(@Param('channel_id') channel_id: string) {
//     return this.chatmessageService.findChannelMsgs(+channel_id);
//   }

  // GET ALL CHAT MESSAGES WITHIN ONE CHANNEL FILTERED
  @Get('filtered/:player_id')
  findChannelMsgsFiltered(@Param('player_id') player_id: string, @Query('channel_id') channel_id: string) {
    return this.chatmessageService.findChannelMsgsFiltered(+player_id, +channel_id);
  }
  // example: localhost:3000/chatmessage/filtered/40?channel_id=13

//   @Get('time/:message_id')
//   findTimeMsg(@Param('message_id') message_id: string) {
//     return this.chatmessageService.findTimeMsg(+message_id);
//   }

//   @Get('date/:message_id')
//   findDateMsg(@Param('message_id') message_id: string) {
//     return this.chatmessageService.findDateMsg(+message_id);
//   }
}
