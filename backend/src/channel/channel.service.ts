import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ChannelmemberService } from '../channelmember/channelmember.service';
import { CreateChannelmemberDto } from '../channelmember/dto/create-channelmember.dto';
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

      const newChannel = await prisma.channel.create({
        data: channelData,
      });
      this.logger.log(`create new channel ${newChannel.name}`);

      // add channel owner as a member
      const channelMemberDto: CreateChannelmemberDto = new CreateChannelmemberDto();
      channelMemberDto.member_id = createChannelDto.owner_id;
      channelMemberDto.channel_id = newChannel.id;
      channelMemberDto.is_admin = true;
      channelMemberDto.is_muted = false;
      channelMemberDto.is_banned = false;
      channelMemberDto.added_at = new Date();
      channelMemberDto.muted_at = new Date();
      await this.channelmemberService.createChannelmember(channelMemberDto);
      this.logger.log('create new channelmember');

      return newChannel.id;
    }
    catch (error) {
      console.error('Error occurred:', error);
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
        });
        return selectedChannel;
    }
    catch (error) {
        console.error('Error occurred:', error);
        return null;
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
  // returns updated channel on succes, nothing on error (or when channel is removed)
  async setNewOwner(id: number) {
    try {
        console.log('finding new owner....');
        const newOwner = await this.channelmemberService.findNewOwner(id);
        if (!newOwner)
        {
            //remove channel?
            this.logger.log("There are no more channelmembers");
            return null;
        }

        const updatedChannel = await prisma.channel.update({
            where: {
                id: id
            },
            data: {
                owner_id: newOwner.member_id
            }
        })
        this.logger.log(`set new owner for channel ${updatedChannel.name}`);

        return updatedChannel;

    }
    catch(error) {
        console.log("Error setting new owner: ", error);
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

  //ENCRYPT PASSWORD
  // returns hash, nothing or error;
  async encryptPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (hash)
        return hash;
    return null;
  }
}
