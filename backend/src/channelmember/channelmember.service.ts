import { Injectable } from '@nestjs/common';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FriendService } from 'src/friend/friend.service';
import { Logger } from '@nestjs/common';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelmemberService {

  constructor(
    private readonly friendService: FriendService
  ) {}

  private logger = new Logger('ChannelService');

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
      this.logger.log('create new channelmember');
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
  async findPlayerChannels(player_id: number) {
    try {
      return prisma.channelMember.findMany({
          where: {
            member_id: player_id
          },
          include: {
                member: {
                  select: {
                    username: true,
                    intra_username: true
                  }
                },
                channel: {
                  select: {
                      name: true,
                      owner_id: true,
                      is_dm: true
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

  // FIND ALL CHANNELS WHERE PLAYER IS MEMBER
  async findPlayerDms(player_id: number) {
    try {
        const allChannels = await this.findPlayerChannels(player_id);
        const allDM = allMembers.filter((member) => member.is_admin === true);

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
            channel_id: true,
            member: {
                select: {
                username: true,
                intra_username: true
                }
            },
            channel: {
                select: {
                    name: true,
                    owner_id: true
                }
            },
            is_admin: true,
            is_muted: true,
            is_banned: true,
            added_at: true,
            muted_at: true
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

  // GET A PLAYERS' BLOCK/ADMIN/MUTE/DELETE ANOTHER MEMBER RIGHTS
  async findRights(player_id: number, member_id: number, channel_id: number) {
    try {
      const rights = {
        memberIsAdmin: false,
        memberIsOwner: false,
        memberIsBanned: false,
        memberIsMuted: false,
        memberIsFriend: false,
        showBlock: true, // player can always block someone
        showMute: false,
        showMakeAdmin: false,
        showBan: false,
        showDelete: false
      }
      const player = await this.findChannelmember(player_id, channel_id);
      const member =  await this.findChannelmember(member_id, channel_id);
      if (!player || !member) {
        throw new Error("Player or member does not exist");
      }

      // Define rights of channelmember
      rights.memberIsAdmin = member.is_admin;
      rights.memberIsOwner = member.is_owner;
      rights.memberIsBanned = member.is_banned;
      rights.memberIsMuted = member.is_muted;
      
      // Define if player and channelmember are friends
      const existingFriendship = await this.friendService.isExistingFriendship(player_id, member_id);
      if (existingFriendship)
        rights.memberIsFriend = true;

      // Define which options the player will have to do with another channelmember
      if (player.is_admin && !member.is_admin) {
        rights.showMakeAdmin = true;
      }
      if (player.is_admin && !member.is_owner && !member.is_muted) {
        rights.showMute = true;
      }
      if (player.is_admin && !member.is_owner && !member.is_banned) {
        rights.showBan = true;
      }
      if (player.is_admin && !member.is_owner) {
        rights.showDelete = true;
      }
      return rights;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // CHECK IF A PLAYER IS ALREADY IN CHANNEL
  async isInChannel(player_id: number, channel_id: number) {
    try {
      const existingMember = await prisma.channelMember.findFirst({
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

  // FIND NEW OWNER (IN CASE THE OWNER WANTS TO LEAVE A CHANNEL)
  // returns new owner on succes, nothing on error
  async findNewOwner(channel_id: number) {
    const allMembers = await this.findAllChannelmembers(channel_id);

    if (allMembers.length == 0) //if there are no members
    {
        console.log('no other members left in channel');
        return null;
    }

    var newOwner;
    const allAdmins = allMembers.filter((member) => member.is_admin === true);
    console.log('all admins ', allAdmins);
    if (allAdmins.length != 0)
    {
        newOwner = allAdmins.reduce((prevMember, currentMember) => {
            return prevMember.member_id < currentMember.member_id ? prevMember : currentMember;
        });
    }
    else // if there are no other admins
    {
        console.log('no admin members left in channel');
        newOwner = allMembers.reduce((prevMember, currentMember) => {
            return prevMember.member_id < currentMember.member_id ? prevMember : currentMember;
        });
    }
    
    return newOwner;
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
        this.logger.log(`${updater.member.username} made ${toUpdate.member.username} admin`);
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
            is_banned: true,
          }
        });
        this.logger.log(`${updater.member.username} banned ${toUpdate.member.username}`);
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

  // MUTE/UNMUTE A CHANNELMEMBER
  // only possible if done by admin
  // owner can not be muted
  // in case of unmute, Date is set to null
  async muteMember(player_id: number, updateChannelmemberDto: UpdateChannelmemberDto, toMute: boolean) {
    try {
      const updater = await this.findChannelmember(player_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
      var date = new Date();

      if (!toMute)
        date = null;

      if (updater.is_admin && !toUpdate.is_owner) {
        const updatedMember = await prisma.channelMember.update({
          where: {
            id: toUpdate.id
          },
          data: {
            is_muted: toMute,
            muted_at: date
          }
        });

        if (toMute)
            this.logger.log(`${updater.member.username} muted ${toUpdate.member.username}`);
        else
            this.logger.log(`${updater.member.username} unmuted ${toUpdate.member.username}`);

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
  // only possible if done by admin or if player wants to leave chat
  // returns deleted channelmember on success, nothing on error
  async remove(player_id: number, updateChannelmemberDto: UpdateChannelmemberDto) {
    try {
    //   console.log('player_id: ', player_id);
    //   console.log('memberdto: ', updateChannelmemberDto);
      const updater = await this.findChannelmember(player_id, updateChannelmemberDto.channel_id);
      const toUpdate = await this.findChannelmember(updateChannelmemberDto.member_id, updateChannelmemberDto.channel_id);
    //   console.log('updater: ', updater);
    //   console.log('toUpdate: ', toUpdate);
      if ((updater.is_admin && !toUpdate.is_owner) || updater.member_id === toUpdate.member_id) {
        const deletedMember = await prisma.channelMember.delete({
          where: {
            id: toUpdate.id,
          }
        });
        deletedMember['is_owner'] = toUpdate.is_owner;
        this.logger.log(`${updater.member.username} removed ${toUpdate.member.username}`);
        
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
