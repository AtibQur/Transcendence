import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  // here should be the entry of the database
  messages: Message[] = [];
  
  create(createMessageDto: CreateMessageDto, clientName: string) {
    const message = {
		name: clientName,
		text: createMessageDto.text,
		id: createMessageDto.id,
	};
	console.log(message);
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages; //here should come a query to select all from message table
  }

  clearAll() {
    return this.messages.splice(0);;
  }
}
