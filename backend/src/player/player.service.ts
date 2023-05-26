import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class PlayerService {

  // CREATE NEW PLAYER
  async createPlayer(createPlayerDto: CreatePlayerDto) {
    try {
      const newPlayer = await prisma.player.create({
        data: {
          username: createPlayerDto.username,
          intra_username: createPlayerDto.username,
          password: 'geheim',
          player_stats: {
            create: {
              wins: 0,
              losses: 0,
              ladder_level: 1,
              achievements: [],
              status: 'online',
            },
          },
        },
        include: { player_stats: true },
      });
      console.log('User saved in db:', newPlayer.username);
      console.log('PlayerStats initialized:', newPlayer.player_stats);
      return `This action adds a new player: ${createPlayerDto.username}`;
    } catch (error) {
      console.error('Error occurred:', error);
    }
}

  findAll() {
    return `This action returns all player`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  // CHANGE USERNAME
  async updateUsername(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          username: updatePlayerDto.username,
        },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // +1 THE WINS
  async updateWins(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          player_stats: {
            update: {
              wins: { increment: 1 },
            },
          },
        },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // +1 LOSSES
  async updateLosses(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          player_stats: {
            update: {
              losses: { increment: 1 },
            },
          },
        },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }
  
  // +1 LEVEL
  async updateLevel(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          player_stats: {
            update: {
              ladder_level: { increment: 1 },
            },
          },
        },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // CHANGE STATUS
  async updateStatus(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          player_stats: {
            update: {
              status: updatePlayerDto.status,
            },
          },
        },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // DELETE A PLAYER
  async deletePlayer(id: number) {
    try {
      const deletedPlayer = await prisma.player.delete({
        where: {
          id: id,
        },
      });
      console.log('Player deleted:', deletedPlayer);
      return `This action removes a #${id} player`;
    }
    catch (error) {
      console.error('Error deleting player:', error);
    }
  }
}
