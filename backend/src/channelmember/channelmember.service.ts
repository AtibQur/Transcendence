import { Injectable } from '@nestjs/common';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelmemberService {

  // CREATE NEW CHANNEL MEMBER
  async createChannelmember(createChannelmemberDto: CreateChannelmemberDto) {
    try {
      const data: any = {
        member_id: createChannelmemberDto.member_id,
        channel_id: createChannelmemberDto.channel_id,
        is_admin: createChannelmemberDto.is_admin,
        is_muted: createChannelmemberDto.is_muted,
        is_banned: createChannelmemberDto.is_banned,
        added_at: new Date(createChannelmemberDto.added_at),
      };
  
      if (createChannelmemberDto.is_muted) {
        data.muted_at = new Date(createChannelmemberDto.muted_at);
      }
  
      await prisma.channelMember.create({
        data,
      });
  
      return `This action adds a new channelmember: ${createChannelmemberDto.member_id}`;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  findAll() {
    return `This action returns all channelmember`;
  }
  
  //FIND ALL CHANNELS OF PLAYER
  async findAllChannels(id: number) {
    return prisma.channelMember.findMany({
        where: {
          member_id: id
        },
        select: {
            channel_id: true
        }
      });
  }
  
  //FIND ALL CHANNELMEMBERS
  findAllChannelmembers(id: number) {
    return prisma.channelMember.findMany({
        where: {
          channel_id: id
        },
        select: {
            member_id: true
        }
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} channelmember`;
  }

  update(id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    return `This action updates a #${id} channelmember`;
  }

  // DELETE A CHANNELMEMBER
  async remove(id: number) {
    try {
      await prisma.channelMember.delete({
        where: {
          id: id,
        },
      });
      return `This action removes a #${id} channelmember`;
    }
    catch (error) {
      console.error('Error deleting member:', error);
    }
  }


}
