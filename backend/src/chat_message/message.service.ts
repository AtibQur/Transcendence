import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class MessageService {
  // here should be the entry of the database
  messages: Message[] = [];
  
  create(createMessageDto: CreateMessageDto) {
    const message = {
		sender: createMessageDto.sender,
		channel: createMessageDto.channel,
		text: createMessageDto.text,
	};
	console.log(message);
    this.messages.push(message);
    return message;
  }

  findAllChannelMessages(channelName: string) {
    return this.messages.filter(message => message.channel === channelName);
  }

//   clearAll() {
//     return this.messages.splice(0);;
//   }
}
