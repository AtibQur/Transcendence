import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  // here should be the entry of the database
  messages: Message[] = [{ name: 'Tessa', text: 'hiii', id: 0}];
  clientToUser = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  deleteUser(clientId: string) {
    console.log(this.clientToUser);
    delete this.clientToUser[clientId];
    console.log(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
		name: this.clientToUser[clientId],
		text: createMessageDto.text,
		id: 1,
	};
    this.messages.push(message); // to do: improve
    return message;
  }

  findAll() {
    return this.messages; //here should come a query to select all from message table
  }

  clearAll() {
    return this.messages.splice(0);;
  }
}
