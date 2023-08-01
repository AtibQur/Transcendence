import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerService } from 'src/player/player.service';
import { UpdateMatchDto } from './dto/update-match.dto';

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
          player_points: 0,
          opponent_points: 0,
          timestamp: new Date(),
        },
      });
      return newMatch;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // UPDATE MATCH POINTS AFTER FINISH
  async finishMatch(match_id: number, updateMatchDto: UpdateMatchDto) {
    try {
      if (updateMatchDto.player_points === undefined || updateMatchDto.opponent_points === undefined){
        throw new Error("Missing player points or opponent points");
      }
      const finishedMatch = await prisma.match.update({
        where: {
          id: match_id,
        },
        data: {
          player_points: updateMatchDto.player_points,
          opponent_points: updateMatchDto.opponent_points,
          timestamp: new Date(),
        }
      });
      if (finishedMatch.player_points > finishedMatch.opponent_points) {
        this.playerService.updateWins(finishedMatch.player_id);
        this.playerService.updateLosses(finishedMatch.opponent_id);
      }
      else {
        this.playerService.updateWins(finishedMatch.opponent_id);
        this.playerService.updateLosses(finishedMatch.player_id);
      }
      return finishedMatch;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET A PLAYERS MATCH HISTORY
  async findMatchHistory(id: number) {
    try {
      const matchHistory = await prisma.match.findMany({
        where: {
          OR: [
            { player_id: id },
            { opponent_id: id }
          ],
          NOT: [
            { player_points: 0, opponent_points: 0 }
          ]
        },
        include: {
          player: {
            select: {
              username: true
            }
          },
          opponent: {
            select: {
              username: true
            }
          }
        }
      });
      return matchHistory;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // TOTAL AMOUNT OF MATCHES PLAYED BY PLAYER (id)
  async findTotalMatches(id: number) {
    try {
      const allMatches = await this.findMatchHistory(+id)
      return Object.keys(allMatches).length;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }
}