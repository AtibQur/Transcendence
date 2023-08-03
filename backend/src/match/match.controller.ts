import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { AuthGuard } from '../auth/local.authguard';
import { UseGuards } from '@nestjs/common';

@Controller('match')
@UseGuards(AuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // INITIALIZE MATCH, SET SCORE TO 0 - 0
  // returns created match including unique match id
  @Post('create')
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.createMatch(createMatchDto);
  }

  // UPDATE MATCH POINTS AFTER FINISH
  // returns updated match
  @Patch('finish/:match_id')
  finishMatch(@Param('match_id') match_id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.finishMatch(+match_id, updateMatchDto);
  }

  // GET A PLAYERS MATCH HISTORY
  // returns match history with usernames on success, nothing on failure
  @Get('history/:id')
  findMatchHistory(@Param('id') id: string) {
    return this.matchService.findMatchHistory(+id);
  }

  // GET TOTAL AMOUNT OF MATCHES PLAYED BY PLAYER (id)
  // returns number of matches on success, nothing on failure
  @Get('total/:id')
  findTotalMatches(@Param('id') id: string) {
    return this.matchService.findTotalMatches(+id);
  }
}
