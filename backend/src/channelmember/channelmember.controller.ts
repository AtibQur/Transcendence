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
