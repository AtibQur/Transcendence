import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { CreateChannelmemberDto } from './dto/create-channelmember.dto';
import { UpdateChannelmemberDto } from './dto/update-channelmember.dto';

@Controller('channelmember')
export class ChannelmemberController {
  constructor(private readonly channelmemberService: ChannelmemberService) {}

  @Post('create')
  create(@Body() createChannelmemberDto: CreateChannelmemberDto) {
    return this.channelmemberService.createChannelmember(createChannelmemberDto);
  }

  @Get()
  findAll() {
    return this.channelmemberService.findAll();
  }

  @Get('allchannels/:id')
  findPlayerChannels(@Param('id') id: string) {
    return this.channelmemberService.findPlayerChannels(+id);
  }

  @Get('allmembers/:channel_id')
  findAllChannelmembers(@Param('channel_id') channel_id: string) {
    return this.channelmemberService.findAllChannelmembers(+channel_id);
  }

  @Get('admin/:id/:channel_id')
  findIsAdmin(
    @Param('id') id: string,
    @Param('channel_id') channel_id: string
  ) {
    return this.channelmemberService.findIsAdmin(+id, +channel_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelmemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelmemberDto: UpdateChannelmemberDto) {
    return this.channelmemberService.update(+id, updateChannelmemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelmemberService.remove(+id);
  }
}
