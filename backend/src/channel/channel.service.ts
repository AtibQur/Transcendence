import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ChannelmemberService } from '../channelmember/channelmember.service'
import { CreateChannelmemberDto } from '../channelmember/dto/create-channelmember.dto';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelService {

  constructor(
    private readonly channelmemberService: ChannelmemberService
  ) {}

  // CREATE NEW CHANNEL
  async createChannel(createChannelDto: CreateChannelDto) {
    try {
      const channelData: CreateChannelDto = {
        name: createChannelDto.name,
        is_private: createChannelDto.is_private,
        owner_id: createChannelDto.owner_id,
      };

      if (createChannelDto.is_private) {
        channelData.password = createChannelDto.password;
      }

      const newChannel = await prisma.channel.create({
        data: channelData,
      });
      // add channel owner as a member
      const channelMemberDto: CreateChannelmemberDto = new CreateChannelmemberDto();
      channelMemberDto.member_id = createChannelDto.owner_id;
      channelMemberDto.channel_id = newChannel.id;
      channelMemberDto.is_admin = true;
      channelMemberDto.is_muted = false;
      channelMemberDto.is_banned = false;
      channelMemberDto.added_at = new Date();
      channelMemberDto.muted_at = new Date();
      this.channelmemberService.createChannelmember(channelMemberDto);
      return newChannel.id;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async findOneChannel(id: number) {
    try {
        const selectedChannel = await prisma.channel.findUnique({
            where: {
              id: id,
            },
          });
  
          return selectedChannel;
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
  }
//   async findAllChannelName(id: number) {
//     try {
//         const selectedChannel = await prisma.channel.findUnique({
//         where: {
//             id: id,
//         },
//         select: {
//             name: true
//         }
//         });
//         return selectedChannel.name;
//     }
//     catch (error) {
//         console.error('Error occurred:', error);
//     }
//   }
}
