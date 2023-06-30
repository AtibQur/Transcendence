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
        added_at: new Date(),
      };
  
      if (createChannelmemberDto.is_muted) {
        data.muted_at = new Date();
      }
  
      await prisma.channelMember.create({
        data,
      });
  
      return 'Player is added to channel';
    } catch (error) {
        if (error.code === 'P2002') {
            return 'Player is already member of this channel';
        }
       console.error('Error occurred:', error);
    }
  }

  findAll() {
    return `This action returns all channelmember`;
  }
  
  // FIND ALL CHANNELS OF PLAYER
  async findPlayerChannels(id: number) {
    return prisma.channelMember.findMany({
        where: {
          member_id: id
        },
        include: {
            channel: {
                select: {
                    name: true
                }
            }
        },
      });
  }
  
  // FIND ALL CHANNELMEMBERS OF CHANNEL
  findAllChannelmembers(channel_id: number) {
    return prisma.channelMember.findMany({
        where: {
          channel_id: channel_id
        },
        select: {
            member_id: true
        }
      });
  }

  // FIND ALL CHANNELMEMBERS OF CHANNEL
  findAllChannelmembersNames(channel_id: number) {
   
    return prisma.channelMember.findMany({
        where: {
            channel_id: channel_id
        },
        include: {
            member: {
              select: {
                username: true
              }
            }
        }
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} channelmember`;
  }

  update(id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    return `This action updates a #${id} channelmember`;
  }

  // CHECK IF MEMBER IS ADMIN
  async findIsAdmin(playerId: number, channelId: number) {
    try {
        const selectedChannelmember = await prisma.channelMember.findMany({
            where: {
                member_id: playerId,
                channel_id: channelId
            },
            select: {
                is_admin: true
            }
        })

        return selectedChannelmember[0].is_admin;
    } catch (error) {
        console.log('Error checking if channelmember is admin: ', error);
    }
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
