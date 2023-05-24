import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

const prisma = PrismaService.getClient();

@Injectable()
export class CrudService {
  // CREATE NEW PLAYER
  async createPlayer(username: string): Promise<void> {
      try {
        const newPlayer = await prisma.player.create({
          data: {
            username: username,
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
      } catch (error) {
        console.error('Error occurred:', error);
      }
  }

  // +1 THE WINS OF PLAYER #id
  async updateWins(id: number): Promise<void> {
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

  // +1 THE LOSSES OF PLAYER #id
  async updateLosses(id: number): Promise<void> {
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

  // +1 THE LEVEL OF PLAYER #id
  async updateLevel(id: number): Promise<void> {
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
}