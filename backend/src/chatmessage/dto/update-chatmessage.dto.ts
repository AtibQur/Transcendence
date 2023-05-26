import { PartialType } from '@nestjs/mapped-types';
import { CreateChatmessageDto } from './create-chatmessage.dto';

export class UpdateChatmessageDto extends PartialType(CreateChatmessageDto) {}
