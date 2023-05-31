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
      const channelData: any = {
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
      console.log('Channel saved in db:', newChannel);
      return `This action adds a new channel: ${createChannelDto.name}
              and adds the owner #${createChannelDto.owner_id} as a member`;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }


  findAll() {
    return `This action returns all channel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
