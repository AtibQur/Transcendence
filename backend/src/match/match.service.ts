import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerService } from 'src/player/player.service';

const prisma = PrismaService.getClient();

@Injectable()
export class MatchService {

  constructor(
    private readonly playerService: PlayerService
  ) {}

  // CREATE NEW MATCH
  async createMatch(createMatchDto: CreateMatchDto) {
    try {
      const newMatch = await prisma.match.create({
        data: {
          player_id: createMatchDto.player_id,
          opponent_id: createMatchDto.opponent_id,
          player_points: createMatchDto.player_points,
          opponent_points: createMatchDto.opponent_points,
          timestamp: new Date(),
        },
      });
      if (newMatch.player_points > newMatch.opponent_points) {
        this.playerService.updateWins(newMatch.player_id);
        this.playerService.updateLosses(newMatch.opponent_id);
      }
      else {
        this.playerService.updateWins(newMatch.opponent_id);
        this.playerService.updateLosses(newMatch.player_id);
      }
      return `This action adds a new match: match #${newMatch.id}`;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  findAll() {
    return prisma.match.findMany({});
  }

  findMatchHistory(id: number) {
    return prisma.match.findMany({
      where: {
        OR: [
          { player_id: id },
          { opponent_id: id }
        ]
      },
    });
  }

}