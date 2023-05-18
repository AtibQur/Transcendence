import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:8080',
	},
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
      const message = await this.messagesService.create(createMessageDto, client.id);

      this.server.emit('message', message);

      return message;
    }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('clearAllMessages')
  clearAll() {
	return this.messagesService.clearAll();
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @MessageBody('newUser') newUser: boolean,
    @ConnectedSocket() client: Socket,
  ) {
        client.broadcast.emit('userJoined', { name, newUser });
        return this.messagesService.identify(name, client.id);
    }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
        const name = await this.messagesService.getClientName(client.id);
        client.broadcast.emit('typing', { name, isTyping }); // ensure that is not send to the sender itself!
    }

    @SubscribeMessage('leave')
    leaveRoom(
        @MessageBody('name') name: string,
        @MessageBody('hasLeft') newUser: boolean,
        @ConnectedSocket() client: Socket,
    ) {
          client.broadcast.emit('userLeft', { name, hasLeft: true});
          this.messagesService.deleteUser(client.id);
      }
}
