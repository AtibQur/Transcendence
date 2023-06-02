import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelmemberDto } from './create-channelmember.dto';

export class UpdateChannelmemberDto extends PartialType(CreateChannelmemberDto) {}
