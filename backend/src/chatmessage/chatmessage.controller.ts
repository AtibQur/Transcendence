import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
  @Get(':channel_id')
  findChannelMsgs(@Param('channel_id') channel_id: string) {
    return this.chatmessageService.findChannelMsgs(+channel_id);
  }
}