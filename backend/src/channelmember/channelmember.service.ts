import { Injectable } from '@nestjs/common';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelmemberService {

  // ADD PLAYER TO EXISTING CHANNEL
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
  
      const newChannelMember = await prisma.channelMember.create({
        data,
      });

      return newChannelMember;
    }
    catch (error) {
        if (error.code === 'P2002') {
            console.error('Error occurred: Player is already member of this channel');
        }
        else {
          console.error('Error occurred:', error);
        }
      return null;
    }
  }

  // FIND ALL CHANNELS WHERE PLAYER IS MEMBER
  // TODO: move to channels module?
  async findPlayerChannels(id: number) {
    try {
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
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }
  
  // FIND ALL CHANNELMEMBERS OF CHANNEL
  findAllChannelmembers(channel_id: number) {
    try {
      const channelMembers = prisma.channelMember.findMany({
          where: {
            channel_id: channel_id
          },
          select: {
              member_id: true,
              is_admin: true,
              is_muted: true,
              is_banned: true,
              member: {
                select: {
                  username: true
                }
              }
          },
        });
      return channelMembers;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // FIND ALL CHANNELMEMBERS OF CHANNEL
  // TODO: use findAllChannelmembers for this?
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
    }
    catch (error) {
      console.log('Error checking if channelmember is admin: ', error);
      return null;
    }
  }

  // DELETE A PLAYER FROM CHANNEL
  async remove(id: number) {
    try {
      const deletedMember = await prisma.channelMember.delete({
        where: {
          id: id,
        },
      });
      return deletedMember;
    }
    catch (error) {
      console.error('Error deleting member:', error);
      return null;
    }
  }


}
