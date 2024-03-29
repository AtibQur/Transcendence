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
      if (!blockedId) {
        throw new Error("Player does not exist");
      }
      if (await this.isBlocked(id, createBlockedplayerDto.blockedUsername)) {
        throw new Error("You already blocked this player");
      }
      if (blockedId == id) {
        throw new Error("You can not block yourself");
      }
      const blockedPlayer = await prisma.blockedPlayer.create({
        data: {
          player_id: id,
          blocked_id: blockedId,
        },
      });
      return blockedPlayer;
    }
      catch (error) {
      console.error('Error occurred:', error);
      return null;

    }
  }

  // FIND BLOCKED PLAYERS USERNAMES
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
      console.error('Error occurred:', error);
      return null;
    }
  }

  // UNBLOCK A PLAYER
  async unblockPlayer(id: number, deleteBlockedplayerDto: DeleteBlockedplayerDto) {
    try {
      const blockedId = await this.playerService.findIdByUsername(deleteBlockedplayerDto.blockedUsername);
      if (!blockedId) {
        throw new Error("Player does not exist");
      }
      const existingBlock = await this.findBlockedPlayer(id, deleteBlockedplayerDto.blockedUsername)
      if (existingBlock) {
        await prisma.blockedPlayer.delete({
          where: {
            id: existingBlock.id
          }
        })
        return existingBlock;
      }
      else {
        throw new Error("Player was not blocked");
      }
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // FIND BLOCKED PLAYER (RETURNS NOTHING IF PLAYER NOT BLOCKED OR DOESNT EXIST)
  async findBlockedPlayer(id: number, blockedUsername: string) {
    try {
      const blockedId = await this.playerService.findIdByUsername(blockedUsername);
      if (!blockedId) {
        throw new Error("Player does not exist");
      }
      const existingBlock = await prisma.blockedPlayer.findFirst({
        where: {
            player_id: id,
            blocked_id: blockedId,
        },
      });

      return existingBlock;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // CHECK IF A PLAYER IS BLOCKED BY ANOTHER PLAYER
  async isBlocked(id: number, blockedUsername: string) {
    try {
      const existingBlock = await this.findBlockedPlayer(id, blockedUsername);
      if (existingBlock) {
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

}
