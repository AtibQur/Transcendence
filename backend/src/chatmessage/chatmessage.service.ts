import { Injectable } from '@nestjs/common';
import { CreateChatmessageDto } from './dto/create-chatmessage.dto';
import { UpdateChatmessageDto } from './dto/update-chatmessage.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChatmessageService {
  async createChatMessage(createChatmessageDto: CreateChatmessageDto) {
    try {
      const newChatMessage = await prisma.chatMessage.create({
        data: {
          content: createChatmessageDto.content,
          sender_id: createChatmessageDto.sender_id,
          channel_id: createChatmessageDto.channel_id,
          sent_at: new Date(createChatmessageDto.sent_at),
        },
      });
      return newChatMessage;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  findAll() {
    return `This action returns all chatmessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatmessage`;
  }

  update(id: number, updateChatmessageDto: UpdateChatmessageDto) {
    return `This action updates a #${id} chatmessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatmessage`;
  }
}
