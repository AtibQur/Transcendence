import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { File } from 'multer';

const prisma = PrismaService.getClient();

@Injectable()
export class PlayerService {

  // CREATE NEW PLAYER
  async createPlayer(createPlayerDto: CreatePlayerDto) {
    try {
      console.log("CREATING NEW PLAYER")
      const achievements = {
        'First win': false,
        '10 wins': false,
        '50 wins': false,
        '100 wins': false,
        'Reached level 5': false,
        'Reached level 10': false,
        'Reached level 20': false,
        'Reached level 50': false,
        'Reached level 100': false,
        'First friend': false,
        '5 friends': false,
        '10 friends': false,
        '50 friends': false,
        'First chat messages sent': false,
        '10 chat messages sent': false,
      };
      if (await this.isExistingIntraPlayer(createPlayerDto.username)) {
        return await this.findIdByIntraUsername(createPlayerDto.username);
      }
      const newPlayer = await prisma.player.create({
        data: {
          username: createPlayerDto.username,
          intra_username: createPlayerDto.username,
          player_stats: {
            create: {
              wins: 0,
              losses: 0,
              ladder_level: 1,
              achievements: achievements,
              status: 'online',
            },
          },
        },
        include: { player_stats: true },
      });
      return newPlayer.id;
    }
    catch (error) {
        if (error.code === 'P2002') {
            console.error('Player already exists');
            return await this.findIdByUsername(createPlayerDto.username);
        }
        console.error('Error occurred:', error);
    }
  }

  // UPLOAD AN AVATAR
  async uploadAvatar(id: number, file: File) {
    try {
      const avatarBytes = file.buffer;
      const updatedPlayer = await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          avatar: avatarBytes
        }
      });
      return updatedPlayer.avatar;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  // GET ID BY USERNAME
  async findIdByUsername(username: string) {
    try {
        const selectedPlayer = await prisma.player.findUnique({
          where: {
            username: username,
          },
          select: {
            id: true,
          },
        });
        return selectedPlayer.id;
      } catch (error) {
        console.error('Error searching for user:', error);
        return null;
    }
}

  // GET ID BY INTRA USERNAME
  async findIdByIntraUsername(intraUsername: string) {
    try {
        const selectedPlayer = await prisma.player.findFirst({
          where: {
            intra_username: intraUsername,
          },
          select: {
            id: true,
          },
        });
        return selectedPlayer.id;
      } catch (error) {
        console.error('Error searching for user:', error);
        return null;
    }
}

// GET INTRANAME BY USERNAME
async findIntraByUsername(username: string) {
  try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          username: username,
        },
        select: {
          intra_username: true,
        },
      });
      return selectedPlayer.intra_username;
    }
    catch (error) {
      console.error('Error searching for user:', error);
      return null;
    }
}

// GET USERNAME BY INTRANAME
async findUsernameByIntra(intraUsername: string) {
  try {
      const selectedPlayer = await prisma.player.findFirst({
        where: {
          intra_username: intraUsername,
        },
        select: {
          username: true,
        },
      });
      return selectedPlayer.username;
    }
    catch (error) {
      console.error('Error searching for user:', error);
      return null;
    }
}

  // FIND ALL ONLINE PLAYERS
  // TODO: this function is not used/finished
  async findAllOnlinePlayers() {
    try {
      return prisma.playerStats.findMany({
          select: {
            player: {
              select: {
                username: true,
              },
            }
          },
      });
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET ALL PLAYER STATS (FOR LEADERBOARD)
  async findAllStats() {
    try {
      const leaderboardData = await prisma.playerStats.findMany({
        select: {
          player: {
            select: {
              id: true,
              username: true
            },
          },
          wins: true,
          losses: true,
          ladder_level: true,
        },
        orderBy: {
          ladder_level: 'desc',
        },
      });
      return leaderboardData;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET ALL STATS FOR ONE PLAYER
  findOneStats(id: number) {
    try {
      const playerStats =  prisma.playerStats.findUnique({
        where: {
          id: id,
        },
        select: {
          wins: true,
          losses: true,
          ladder_level: true,
        },
      });
      return playerStats;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET 2FA STATUS
  async findOne2FA(id: number) {
    try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          two_factor_enabled: true
        }
      });
      return selectedPlayer.two_factor_enabled;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET 2FA CODE

  async findOne2FACode(id: number) {
    try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          two_factor_code: true
        }
      });
      return selectedPlayer.two_factor_code;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET PLAYERS ACHIEVEMENTS
  async findOneAchievements(id: number) {
    try {
      const selectedPlayer = await prisma.playerStats.findUnique({
        where: {
          id: id,
        },
        select: {
          achievements: true,
        },
      });
      return selectedPlayer.achievements;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // FIND TOTAL AMOUNT OF A PLAYERS ACHIEVEMENTS
  async findAchievementsTotal(id:number) {
    try {
      const allAchievements = await this.findOneAchievements(id);
      const trueAchievements = Object.values(allAchievements).filter(value => value === true);
      return trueAchievements.length;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET USERNAME
  async findOneUsername(id: number) {
    try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          username: true
        }
      });
      return selectedPlayer.username;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  //DUBBEL?!
  async findOnePlayerByUsername(id: number) {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          username: true
        }
      });
      return selectedPlayer;
    };

  async findOneIntraUsername(player_id: number) {
    try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: player_id,
        },
        select: {
          intra_username: true
        }
      });
      return selectedPlayer.intra_username;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET AVATAR
  async findOneAvatar(id: number) {
    try {
      const selectedPlayer = await prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          avatar: true
        }
      });
      return selectedPlayer.avatar;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // CHECK IF AVATAR IS SET
  async hasAvatar(id: number) {
    try {
      const avatar = await this.findOneAvatar(id);
      if (avatar) {
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

  // GET PERCENTAGE WINS
  async findPercentageWins(id: number) {
    try {
      const playerStats = await this.findOneStats(id);
      const totalGames = playerStats.wins + playerStats.losses;
      if (!totalGames)
        return (0);
      return (playerStats.wins / totalGames * 100);
    } catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // GET STATUS
  async findStatus(id: number) {
    try {
      const selectedPlayer = await prisma.playerStats.findUnique({
        where: {
          id: id,
        },
        select: {
          status: true
        }
      });
      return selectedPlayer.status;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
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
      return updatePlayerDto.username;
    }
    catch (error) {
      if (error.code === 'P2002') {
        console.error('Error occurred: Username already exists');
        return await this.findOneUsername(id);
      }
      console.error('Error occurred:', error);
      return null;
    }
  }

  // +1 THE WINS
  async updateWins(id: number) {
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
      this.calcLadderLevel(id);
      this.updateAchievementsAfterMatch(id);
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // +1 LOSSES
  async updateLosses(id: number) {
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
      this.calcLadderLevel(id);
      this.updateAchievementsAfterMatch(id);
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }
  
  // +1 LEVEL
  async updateLevel(id: number) {
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

  // CHANGE 2FA STATUS
  async update2FA(id: number, status: boolean) {
    try {
      await prisma.player.update({
        where: {
          id: id,
        },
        data: {
          two_factor_enabled: status,
        },
    });
  }
    catch (error) {
      console.error('Error occurred', error);
  }
}

async updateTfaCode(id: number, code: string) {
  try {
    await prisma.player.update({
      where: {
        id: id,
      },
      data: {
        two_factor_code: code,
      },
    });
  }
  catch (error) {
    console.error('Error occurred', error);
  }
}

  // CHANGE STATUS
  async updateStatus(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
        const updatedPlayer = await prisma.player.update({
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
      return updatedPlayer;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
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
      return deletedPlayer;
    }
    catch (error) {
      console.error('Error deleting player:', error);
      return null;
    }
  }

  // UPDATE LADDER LEVEL (only called from the calcLadderLevel function)
  async updateLadderLevel(id: number, newLevel: number) {
    try {
      await prisma.playerStats.update({
        where: {
          id: id,
        },
        data: {
          ladder_level: newLevel,
        },
      });
      this.updateAchievementsAfterMatch(id);
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // CALCULATE LADDER LEVEL SCORE
  async calcLadderLevel(id: number) {
    const playerStatsData = await this.findOneStats(id);
    const achievements = await this.findOneAchievements(id);
    const achievedCount = Object.values(achievements).filter(value => value === true).length;
    let ladderLevel = (playerStatsData.wins * 2) - playerStatsData.losses + achievedCount;
    ladderLevel = Math.max(ladderLevel, 1);

    this.updateLadderLevel(id, ladderLevel);
  }

  // ACHIEVE AN ACHIEVEMENT
  async achieveAchievement(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      let achievements = await this.findOneAchievements(id);
      if (achievements.hasOwnProperty(updatePlayerDto.achieved)) {
        achievements[updatePlayerDto.achieved] = true;
      }
      else {
        return ('Error: invalid achievement');
      }
      await prisma.playerStats.update({
        where: {
          id: id,
        },
        data: {
          achievements: achievements,
        },
      });
      return (achievements);
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  // CHECK IF PLAYER EXISTS
  async isExistingPlayer(username: string) {
    try {
      const existingPlayer = await prisma.player.findUnique({
          where: {
            username: username,
          },
      });
      if (existingPlayer) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (error) {
      return false;
    }
  }

  // CHECK IF PLAYER EXISTS
  async isExistingIntraPlayer(intraUsername: string) {
    try {
      const existingPlayer = await prisma.player.findFirst({
          where: {
            intra_username: intraUsername,
          },
      });
      if (existingPlayer) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (error) {
      return false;
    }
  }

  // CHECK ALL ACHIEVEMENTS, UPDATE IF ANYTHING NEW IS ACHIEVED
  async updateAchievementsAfterMatch(id: number) {
    const allPlayerStats = await this.findOneStats(id);
    const updateDto: UpdatePlayerDto = {
      achieved: ''
    };

    if (allPlayerStats.ladder_level >= 100) {
      updateDto.achieved = 'Reached level 100'
    }
    else if (allPlayerStats.ladder_level >= 50) {
      updateDto.achieved = 'Reached level 50'
    }
    else if (allPlayerStats.ladder_level >= 20) {
      updateDto.achieved = 'Reached level 20'
    }
    else if (allPlayerStats.ladder_level >= 10) {
      updateDto.achieved = 'Reached level 10'
    }
    else if (allPlayerStats.ladder_level >= 5) {
      updateDto.achieved = 'Reached level 5'
    }
    await this.achieveAchievement(id, updateDto)
    if (allPlayerStats.wins >= 100) {
      updateDto.achieved = '100 wins'
    }
    else if (allPlayerStats.wins >= 50) {
      updateDto.achieved = '50 wins'
    }
    else if (allPlayerStats.wins >= 10) {
      updateDto.achieved = '10 wins'
    }
    else if (allPlayerStats.wins == 1) {
      updateDto.achieved = 'First win'
    }
    await this.achieveAchievement(id, updateDto)
  }

  // CHECK ALL ACHIEVEMENTS, UPDATE IF ANYTHING NEW IS ACHIEVED
  async updateAchievementsAfterFriendAdd(id: number, numFriends: number) {
    const updateDto: UpdatePlayerDto = {
      achieved: ''
    };

    if (numFriends >= 50) {
      updateDto.achieved = '50 friends';
    }
    else if (numFriends >= 10) {
      updateDto.achieved = '10 friends';
    }
    else if (numFriends >= 5) {
      updateDto.achieved = '5 friends';
    }
    else if (numFriends >= 1) {
      updateDto.achieved = 'First friend';
    }
    await this.achieveAchievement(id, updateDto)
  }

  // CHECK ALL ACHIEVEMENTS, UPDATE IF ANYTHING NEW IS ACHIEVED
  async updateAchievementsAfterMessage(id: number, numMessages: number) {
    const updateDto: UpdatePlayerDto = {
      achieved: ''
    };

    if (numMessages >= 10) {
      updateDto.achieved = '10 chat messages sent';
    }
    else if (numMessages >= 1) {
      updateDto.achieved = 'First chat messages sent';
    }
    await this.achieveAchievement(id, updateDto)
  }
}