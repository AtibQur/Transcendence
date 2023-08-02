import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';


@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  // CREATE NEW PLAYER
  // returns player id of either existing player or new player
  @Post('create')
  @UseGuards(AuthGuard)
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(createPlayerDto);
  }

  // UPLOAD AN AVATAR
  @Post('avatar/upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@Param('id') id: number, @UploadedFile() file: File) {
    return this.playerService.uploadAvatar(+id, file);
  }

  // GET ALL PLAYER STATS (FOR LEADERBOARD)
  @Get('leaderboard')
  @UseGuards(AuthGuard)
  findAllStats() {
    return this.playerService.findAllStats();
  }

  // GET ALL STATS FOR ONE PLAYER
  @Get('stats/:id')
  @UseGuards(AuthGuard)
  findOneStats(@Param('id') id: string) {
    return this.playerService.findOneStats(+id);
  }

  // GET PLAYERS ACHIEVEMENTS
  @Get('achievements/:id')
  @UseGuards(AuthGuard)
  findOneAchievements(@Param('id') id: string) {
    return this.playerService.findOneAchievements(+id);
  }

  // GET NUMBER OF ACHIEVED ACHIEVEMENTS
  @Get('totalachievements/:id')
  @UseGuards(AuthGuard)
  findAchievementsTotal(@Param('id') id: string) {
    return this.playerService.findAchievementsTotal(+id);
  }

  // GET USERNAME
  @Get('username/:id')
  @UseGuards(AuthGuard)
  findOneUsername(@Param('id') id: string) {
    return this.playerService.findOneUsername(+id);
  }

  // GET AVATAR
  // returns avatar as bytes
  @Get('avatar/:id')
  @UseGuards(AuthGuard)
  findOneAvatar(@Param('id') id: string) {
    return this.playerService.findOneAvatar(+id);
  }

  // GET PERCENTAGE WINS
  @Get('percentagewins/:id')
  @UseGuards(AuthGuard)
  findPercentageWins(@Param('id') id: string) {
    return this.playerService.findPercentageWins(+id);
  }

  // GET STATUS
  @Get('status/:id')
  @UseGuards(AuthGuard)
  findStatus(@Param('id') id: string) {
    return this.playerService.findStatus(+id);
  }

  // CHANGE USERNAME
  // returns new username on success, old username on error
  @Patch('username/:id')
  @UseGuards(AuthGuard)
  updateUsername(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.updateUsername(+id, updatePlayerDto);
  }

  // CHANGE STATUS
  // returns updated player on success, nothing on error
  @Patch('status/:id')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.updateStatus(+id, updatePlayerDto);
  }

  // DELETE A PLAYER
  // returns deleted player on success, nothing on error
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(+id);
  }

  // ACHIEVE AN ACHIEVEMENT
  // TODO: delete this if never used, probably wont be used
  @Patch('achieve/:id')
  @UseGuards(AuthGuard)
  achieveAchievement(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.achieveAchievement(+id, updatePlayerDto);
  }

  // CHECK IF PLAYER EXISTS
  // returns true or false
  @Get('exists/:username')
  @UseGuards(AuthGuard)
  isExistingPlayer(@Param('username') username: string) {
    return this.playerService.isExistingPlayer(username);
  }

  // GET ID BY USERNAME
  @Get('profile/:username')
  @UseGuards(AuthGuard)
  findIdByUsername(@Param('username') username: string) {
    return this.playerService.findIdByUsername(username);
  }
  // GET ALL ONLINE PLAYERS
  @Get('online')
  @UseGuards(AuthGuard)
  findAllOnlinePlayers() {
    return this.playerService.findAllOnlinePlayers();
  }

}

