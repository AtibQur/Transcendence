import { Injectable } from '@nestjs/common';
import { CreateChatmessageDto } from './dto/create-chatmessage.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { ChannelService } from 'src/channel/channel.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChatmessageService {
  constructor(
    private readonly blockedplayerService: BlockedplayerService,
    private readonly channelService: ChannelService
  ) {}
  
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
            sender: {
              select: {
                username: true
              }
            },
            channel: {
                select: {
                    name: true
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

  // GET ALL CHAT MESSAGES WITHIN ONE CHANNEL FILTERED
  async findChannelMsgsFiltered(player_id: number, channel_id: number) {
    try {
      const allChannelMessages = await prisma.chatMessage.findMany({
        where: {
          channel_id: channel_id
        },
        include: {
          sender: {
            select: {
              username: true
            }
          },
          channel: {
            select: {
              name: true
            }
          }
        },
      });
      const filteredChannelMessages = []
      for (const message of allChannelMessages) {
        const isBlocked = await this.blockedplayerService.isBlocked(player_id, message.sender.username)
        if (!isBlocked) {
          filteredChannelMessages.push(message);
        }
      }

      return filteredChannelMessages;
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

//   async findTimeMsg(message_id: number) {
//     try {
//         const msgFullDate = await prisma.chatMessage.findUnique({
//             where: {
//                 id: message_id
//             },
//             select: {
//                 sent_at: true
//             }
//         })

//         const date = new Date(msgFullDate.sent_at)
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         return `${hours}:${minutes}`;
//     } catch (error) {
//         console.error('Error searching time of message: ', error);
//         return null;
//     }
//   }


//   async findDateMsg(message_id: number) {
//     return prisma.chatMessage.Unique({
//       where: {
//         channel_id: channel_id
//       }
//     });
//   }
}