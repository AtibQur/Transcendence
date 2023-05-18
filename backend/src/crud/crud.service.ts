import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

const prisma = PrismaService.getClient();

@Injectable()
export class CrudService {
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
}
