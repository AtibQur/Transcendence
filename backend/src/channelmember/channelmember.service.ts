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
      if (await this.isInChannel(createChannelmemberDto.member_id, createChannelmemberDto.channel_id)) {
        throw new Error("Player is already in channel");
      }
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
  async findPlayerChannels(player_id: number) {
    try {
      return prisma.channelMember.findMany({
          where: {
            member_id: player_id
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
  async findAllChannelmembers(channel_id: number) {
    try {
      const channelMembers = await prisma.channelMember.findMany({
          where: {
            channel_id: channel_id
          },
          select: {
            member: {
              select: {
                username: true
              }
            },
              member_id: true,
              is_admin: true,
              is_muted: true,
              is_banned: true,
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

// GET A MEMBER'S INFO
async findChannelmember(member_id: number, channel_id: number) {
  try {
    const channelMember = await prisma.channelMember.findFirst({
      where: {
        member_id: member_id,
        channel_id: channel_id
      },
      select: {
        id: true,
        member_id: true,
        member: {
          select: {
            username: true
          }
        },
        channel: {
          select: {
            owner_id: true
          }
        },
        is_admin: true,
        is_muted: true,
        is_banned: true,
      }
    });

    if (channelMember) {
      const isOwner = channelMember.member_id === channelMember.channel.owner_id;
      return {
        ...channelMember,
        is_owner: isOwner
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return null;
  }
}

  // CHECK IF A PLAYER IS ALREADY IN CHANNEL
  async isInChannel(player_id: number, channel_id) {
    try {
      const existingMember = await prisma.channelMember.findMany({
        where: {
          member_id: player_id,
          channel_id: channel_id
        }
      });
      if (existingMember) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (error) {
      console.error('Error occurred:', error);
      return false;
    }
  }

  // CHECK IF MEMBER IS ADMIN
  async findIsAdmin(member_id: number, channel_id: number) {
    try {
        const selectedChannelmember = await prisma.channelMember.findFirst({
            where: {
                member_id: member_id,
                channel_id: channel_id
            },
            select: {
                is_admin: true
            }
        })
        return selectedChannelmember.is_admin;
    }
    catch (error) {
      console.log('Error checking if channelmember is admin: ', error);
      return null;
    }
  }

  // MAKE ANOTHER PLAYER ADMIN
  // only possible if done by admin
  async makeAdmin(player_id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    try {
      const updater = await this.findChannelmember(player_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
      if (updater.is_admin) {
        const updatedMember = await prisma.channelMember.update({
          where: {
            id: toUpdate.id
          },
          data: {
            is_admin: true,
          }
        });
        return updatedMember;
      }
      else {
        throw new Error('Player not allowed to make this change')
      }
    }
    catch (error) {
      console.log('Error occurred: ', error);
      return null;
    }
  }

  // BAN A CHANNELMEMBER
  // only possible if done by admin
  // owner can not be banned
  async banMember(member_id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    try {
      const updater = await this.findChannelmember(member_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
      if (updater.is_admin && !toUpdate.is_owner) {
        const updatedMember = await prisma.channelMember.update({
          where: {
            id: toUpdate.id
          },
          data: {
            is_admin: true,
          }
        });
        return updatedMember;
      }
      else {
        throw new Error('Player not allowed to make this change')
      }
    }
    catch (error) {
      console.log('Error occurred: ', error);
      return null;
    }
  }

  // MUTE A CHANNELMEMBER
  // only possible if done by admin
  // owner can not be muted
  async muteMember(player_id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    try {
      const updater = await this.findChannelmember(player_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
      if (updater.is_admin && !toUpdate.is_owner) {
        const updatedMember = await prisma.channelMember.update({
          where: {
            id: toUpdate.id
          },
          data: {
            is_muted: true,
          }
        });
        return updatedMember;
      }
      else {
        throw new Error('Player not allowed to make this change')
      }
    }
    catch (error) {
      console.log('Error occurred: ', error);
      return null;
    }
  }

  // DELETE A PLAYER FROM CHANNEL
  // owner can not be deleted
  // only possible if done by admin
  // returns deleted channelmember on success, nothing on error
  async remove(player_id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    try {
      const updater = await this.findChannelmember(player_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
      if (updater.is_admin && !toUpdate.is_owner) {
        const deletedMember = await prisma.channelMember.delete({
          where: {
            id: player_id,
          },
        });
        return deletedMember;
      }
      else {
        throw new Error('Player not allowed to delete this member')
      }
    }
    catch (error) {
      console.error('Error deleting member:', error);
      return null;
    }
  }

}
