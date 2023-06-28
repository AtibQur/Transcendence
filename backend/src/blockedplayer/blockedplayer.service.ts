import { Injectable } from '@nestjs/common';
import { CreateBlockedplayerDto } from './dto/create-blockedplayer.dto';
import { DeleteBlockedplayerDto } from './dto/delete-blockedplayer.dto';
import { PlayerService } from 'src/player/player.service';

import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class BlockedplayerService {
  constructor(
    private readonly playerService: PlayerService
  ) {}

  // BLOCK A PLAYER
  async createBlockedplayer(id: number, createBlockedplayerDto: CreateBlockedplayerDto) {
    try {
      const blockedId = await this.playerService.findIdByUsername(createBlockedplayerDto.blockedUsername);
      if (blockedId == -1) {
        return "Player does not exist"
      }
      const existingBlock = await prisma.blockedPlayer.findFirst({
        where: {
              player_id: id,
              blocked_id: blockedId,
        },
      });
      if (existingBlock) {
        return "You already blocked this user.";
      }
      const blockedPlayer = await prisma.blockedPlayer.create({
        data: {
          player_id: id,
          blocked_id: blockedId,
        },
      });
      console.log('Blocked player added:', blockedPlayer);
      return "Successfully blocked player"
    }
      catch (error) {
      console.error('Error adding blocked player:', error);
      return "Error blocking player"

    }
  }

  async findBlockedUsername(id: number) {
    try {
      const blockedPlayers = await prisma.blockedPlayer.findMany({
        where: {
          player_id: id,
        },
        include: {
          blocked: {
            select: {
              username: true,
            }
          }
        }
      })
      const cleanBlockedPlayers = blockedPlayers.map((blockedPlayer) => {
        return {
          username: blockedPlayer.blocked.username,
        }
      });
      return cleanBlockedPlayers;
    }
    catch (error) {
      console.error('Error finding blocked players:', error);
      return "Error finding blocked players"
    }
  }

  findAll() {
    return `This action returns all blockedplayer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blockedplayer`;
  }

  // UNBLOCK A PLAYER
  async unblockPlayer(id: number, deleteBlockedplayerDto: DeleteBlockedplayerDto) {
    try {
      const blockedId = await this.playerService.findIdByUsername(deleteBlockedplayerDto.blockedUsername);
      if (blockedId == -1) {
        return "Player does not exist"
      }
      const existingBlock = await prisma.blockedPlayer.findFirst({
        where: {
              player_id: id,
              blocked_id: blockedId,
        },
      });
      if (existingBlock) {
        await prisma.blockedPlayer.delete({
          where: {
            id: existingBlock.id
          }
        })
        return "Player unblocked";
      }
      else {
        return "This player was not blocked";
      }
    }
      catch (error) {
      console.error('Error adding blocked player:', error);
      return "Error blocking player"
    }
  }
}
