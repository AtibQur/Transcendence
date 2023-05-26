import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelService {

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

      console.log('Channel saved in db:', newChannel.name);
      return `This action adds a new channel: ${createChannelDto.name}`;
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
