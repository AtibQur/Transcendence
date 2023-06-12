import { Injectable } from '@nestjs/common';
import { CreateChatmessageDto } from './dto/create-chatmessage.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChatmessageService {
  
  // CREATE NEW CHAT MESSAGE
  async createChatMessage(createChatmessageDto: CreateChatmessageDto) {
    try {
      const newChatMessage = await prisma.chatMessage.create({
        data: {
          content: createChatmessageDto.content,
          sender_id: createChatmessageDto.sender_id,
          channel_id: createChatmessageDto.channel_id,
          sent_at: new Date(),
        },
        include: {
          channel: {
            select: {
              name: true
            }
          },
          sender: {
            select: {
              username: true
            }
          }
        }
      });
      console.log('Chatmessage is created');
      return newChatMessage;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // GET ALL CHAT MESSAGES WITHIN ONE CHANNEL
  async findChannelMsgs(channel_id: number) {
    return prisma.chatMessage.findMany({
      where: {
        channel_id: channel_id
      }
    });
  }
}