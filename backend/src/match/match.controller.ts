import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.createMatch(createMatchDto);
  }

  // GET ALL PLAYERS MATCH HISTORY
  @Get('history')
  findAll() {
    return this.matchService.findAll();
  }

  // GET A PLAYERS MATCH HISTORY
  @Get('history/:id')
  findMatchHistory(@Param('id') id: string) {
    return this.matchService.findMatchHistory(+id);
  }
} 