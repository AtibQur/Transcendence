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
