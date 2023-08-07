import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ChannelmemberService } from '../channelmember/channelmember.service';
import { CreateChannelmemberDto } from '../channelmember/dto/create-channelmember.dto';
import { DeleteChannelDto } from './dto/delete-channel.dto';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const prisma = PrismaService.getClient();

@Injectable()
export class ChannelService {

  constructor(
    private readonly channelmemberService: ChannelmemberService
  ) {}

  private logger = new Logger('ChannelService');

  // CREATE NEW CHANNEL
  async createChannel(createChannelDto: CreateChannelDto) {
    try {
      const channelData: CreateChannelDto = {
        name: createChannelDto.name,
        is_private: createChannelDto.is_private,
        owner_id: createChannelDto.owner_id,
      };

      if (createChannelDto.password) {
        channelData.password = createChannelDto.password;
      }

      if (createChannelDto.is_dm) {
        channelData.is_dm = createChannelDto.is_dm;
      }

      const newChannel = await prisma.channel.create({
        data: channelData,
      });
      this.logger.log(`create new channel ${newChannel.name}`);

      // add channel owner as a member
      const memberData: CreateChannelmemberDto = {
        member_id: createChannelDto.owner_id,
        channel_id: newChannel.id,
        is_admin: true,
        is_muted: false,
        is_banned: false,
      }

      await this.channelmemberService.createChannelmember(memberData);

      return newChannel.id;
    }
    catch (error) {
      console.error('Error creating channel:', error);
      return null;
    }
  }

  //CREATE DIRECT MESSAGE CHANNEL
  async createDm(player_id: number, friend_id: number) {
    try {
        //create channel with player_id as owner
        const channelData: CreateChannelDto = {
            name: 'dm',
            is_private: true,
            owner_id: player_id,
            is_dm: true
        }
        
        const channel_id = await this.createChannel(channelData);
        if (!channel_id)
            throw new Error();
            
        const memberData: CreateChannelmemberDto = {
            member_id: friend_id,
            channel_id: channel_id,
            is_admin: true
        }
        
        // create channelmember of friend_id
        const friend = await this.channelmemberService.createChannelmember(memberData);
        if (!friend)
            throw new Error();
        
        return channel_id;
    }
    catch (error)
    {
        console.error('Error creating dm: ', error);
        return null;
    }
  }


  // GET CHANNEL INFO (name, is_private, owner_id)
  async findOneChannel(id: number) {
    try {
      const selectedChannel = await prisma.channel.findUnique({
          where: {
            id: id,
          },
          include: {
            members: true
          }
        });
        return selectedChannel;
    }
    catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
  }

  // GET ALL PUBLIC & PROTECTED CHANNELS FOR WHICH THE PLAYER IS NOT MEMBER YET
  async findAllJoinableChannels(player_id: number) {
    try {
        return prisma.channel.findMany({
            where: {
                is_private: false,
                NOT: {
                    members: {
                      some: {
                        member_id: player_id,
                      },
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
        })
    }
    catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
  }

  // Find DM
  // returns dm on success, nothing on error
  async findDm(player_id: number, friend_id: number) {
    try {
      const selectedDm = await prisma.channel.findFirst({
          where: {
            is_dm: true,
            AND: [
                {
                  members: {
                    some: {
                      member_id: player_id,
                    },
                  },
                },
                {
                  members: {
                    some: {
                      member_id: friend_id,
                    },
                  },
                },
              ],
          }
        });
        if (!selectedDm)
            throw new Error();
        return selectedDm;
    }
    catch (error) {
        return null;
    }
  }

  // CHECK IF DM ALREADY EXISTS
  // returns true if it already exists, false if not
  async isExistingDm(player_id: number, friend_id: number) {
    try {
      const selectedDm = await prisma.channel.findFirst({
          where: {
            is_dm: true,
            AND: [
                {
                  members: {
                    some: {
                      member_id: player_id,
                    },
                  },
                },
                {
                  members: {
                    some: {
                      member_id: friend_id,
                    },
                  },
                },
              ],
          }
        });
        if (!selectedDm)
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
  }

  //CHECK IF CHANNEL IS PROTECTED
  //if password is null return false
  //otherwise return true
  async isProtected(id: number) {
    try {
        const selectedChannel = await prisma.channel.findUnique({
            where: {
                id: id,
            },
            select: {
                password: true
            }
        })

        if (selectedChannel.password)
            return true;
            
        return false;

    }
    catch (error) {
        console.log('Error checking if channel is protected: ', error);
        return false;
    }
  }

  //CHECK IF CHANNEL IS A DM
  //returns true on succes, nothing on error
  async isDm(id: number) {
    try {
        const selectedChannel = await prisma.channel.findUnique({
            where: {
                id: id,
            },
            select: {
                is_dm: true
            }
        })

        if (selectedChannel.is_dm)
            return true;
            
        return false;

    }
    catch (error) {
        console.log('Error checking if channel is a dm: ', error);
        return false;
    }
  }

  //FIND ID OF CHANNEL OWNER
  // returns id on success, nothing on error
  async findOwnerId(id: number) {
    try {
        const selectedChannel = await prisma.channel.findUnique({
            where: {
                id: id
            },
            select: {
                owner_id: true
            }
        })

        if (!selectedChannel.owner_id)
            throw new Error();
        return selectedChannel.owner_id;
    }
    catch (error) {
        console.log('Error finding owner id of channel');
        return null;
    }
  }

  //SET NEW OWNER FOR CHANNEL IF THE CURRENT OWNER WANT TO LEAVE THE CHANNEL
  // set to the 'eldest' admin (smallest member id of members)
  // if there are no members left, channel deleted?
  // returns channel id on succes, false if there are no more members and nothing on error
  async setNewOwner(id: number) {
    try {
        console.log('finding new owner....');
        const newOwner = await this.channelmemberService.findNewOwner(id);
        if (!newOwner)
            return false;

        const updatedChannel = await prisma.channel.update({
            where: {
                id: id
            },
            data: {
                owner_id: newOwner.member_id
            }
        })
        this.logger.log(`set new owner for channel ${updatedChannel.name}`);

        return true;

    }
    catch(error) {
        console.log("Error setting new owner: ", error);
        return null;
    }
  }

  //FIND THE HASHED PASSWORD OF A CHANNEL
  // returns hash on success, nothing on error
  async findPassword(id: number) {
    try {
        const selectedChannel = await prisma.channel.findUnique({
            where: {
                id: id
            },
            select: {
                password: true
            }
        })
        
        if (!selectedChannel)
            throw new Error();
        return selectedChannel.password;
    } catch (error) {
        return null;
    }
  }

  //SET PASSWORD FOR CHANNEL
  // can only be done by the owner of the channel
  // returns channel on success, nothing on error
  async setPassword(id: number, player_id: number, updateChannelDto: UpdateChannelDto) {
    try {
        const owner_id  = await this.findOwnerId(id);
        if (!owner_id)
            throw new Error('Could not find owner of Channel');
        
        if (player_id != owner_id)
            throw new Error('Player not allowed to make this change');

        var hash = null; // to make this func reusable when removing password
        if (updateChannelDto.password) {
            hash = await this.encryptPassword(updateChannelDto.password);
            if (!hash)
                throw new Error('Encrypting password failed');
        }
        
        const updatedChannel = await prisma.channel.update({
            where: {
                id: id
            },
            data: {
                password: hash
            }
        })

        this.logger.log(`set password for channel ${updatedChannel.name}`);
        return updatedChannel;

    }
    catch (error) {
        console.log('Error setting password: ', error);
        return null;
    }
  }

  // COMPARES GIVEN PASSWORD WITH PASSWORD OF CHANNEL
  // returns true if they match, otherwise false
  async validatePassword(id: number, password: string) {
    try {
        const hash: string = await this.findPassword(id);
        if (!hash)
            throw new Error();

        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;

    } catch (error) {
        console.log('Error validating password: ', error);
        return null;
    }
  }

  //ENCRYPT PASSWORD
  // returns hash, nothing or error;
  async encryptPassword(password: string) {
    try {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);

        if (hash)
        return hash;

    } catch (error) {
        console.log('Error encrypting password: ', error);
        return null;
    }
  }

  //REMOVE CHANNEL
  // can only be done by the owner or if the last member wants to leave the channel
  // returns deleted channel on success, nothing on error
  async remove(player_id: number, deleteChannelDto: DeleteChannelDto) {
    try {
        const updater = await this.channelmemberService.findChannelmember(player_id, deleteChannelDto.id);

        if (!updater.is_owner)
            throw new Error('player not allowed');
        
        const deletedChannel = await prisma.channel.delete({
            where: {
                id: deleteChannelDto.id,
            },
            include: {
                members: true,
                messages: true
            },
        });

        return deletedChannel;
    } catch (error) {
        console.log('Error deleting channel:', error);
        return null;
    }
  }
}
