import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  // CREATE NEW PLAYER
  @Post('create')
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(createPlayerDto);
  }

  // GET ALL PLAYER STATS (FOR LEADERBOARD)
  @Get('leaderboard')
  findAllStats() {
    return this.playerService.findAllStats();
  }

  // GET ALL STATS FOR ONE PLAYER
  @Get('stats/:id')
  findOneStats(@Param('id') id: string) {
    return this.playerService.findOneStats(+id);
  }

  // GET USERNAME
  @Get('username/:id')
  findOneUsername(@Param('id') id: string) {
    return this.playerService.findOneUsername(+id);
  }

  // GET AVATAR
  @Get('avatar/:id')
  findOneAvatar(@Param('id') id: string) {
    return this.playerService.findOneAvatar(+id);
  }

  // CHANGE USERNAME
  @Patch('username/:id')
  updateUsername(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
      return this.playerService.updateUsername(+id, updatePlayerDto);
  }

  // +1 WINS
  @Patch('wins/:id')
  updateWins(@Param('id') id: string) {
      return this.playerService.updateWins(+id);
  }

  // +1 LOSSES
  @Patch('losses/:id')
  updateLosses(@Param('id') id: string) {
      return this.playerService.updateLosses(+id);
  }

  // +1 LEVEL
  @Patch('level/:id')
  updateLevel(@Param('id') id: string) {
      return this.playerService.updateLevel(+id);
  }

  // CHANGE STATUS
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
      return this.playerService.updateStatus(+id, updatePlayerDto);
  }

  // DELETE A PLAYER
  @Delete('delete/:id')
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(+id);
  }
}