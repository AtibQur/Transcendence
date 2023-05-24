import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from '../message/message.service';
import { PlayerService } from 'src/player/player.service';
import { ChannelService } from 'src/channel/channel.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

    constructor(
        private readonly messageService: MessageService,
        private readonly playerService: PlayerService,
        private readonly channelService: ChannelService,
    ) {}

    //CREATE MESSAGE
    @SubscribeMessage('createMessage')
    async create(
        @MessageBody() createMessageDto: CreateMessageDto,
        @ConnectedSocket() client: Socket,
     ) {
        createMessageDto.id = client.id;
        const message = await this.messageService.create(createMessageDto, this.playerService.getPlayerName(client.id));

        this.server.emit('message', message);

        return message;
    }

    //FIND ALL MESSAGES
    @SubscribeMessage('findAllMessages')
    findAllMessages() {
        return this.messageService.findAll();
    }

    //FIND ALL PLAYERS
    @SubscribeMessage('findAllPlayers')
    findAllPlayers() {
        return this.playerService.findAll();
    }

    //CLEAR ALL MESSAGE -> just for testing purposes
    @SubscribeMessage('clearAllMessages')
    clearAll() {
        return this.messageService.clearAll();
    }

    @SubscribeMessage('addPlayer')
    addPlayer(
        @MessageBody() payload: {username: string},
        @ConnectedSocket() client: Socket,
    ) {
        this.playerService.create(payload.username, client.id);
    }

    //JOIN ROOM -> CREATE PLAYER
    @SubscribeMessage('join')
    joinRoom(
        @MessageBody() payload: {channelName: string, username: string, newUser: boolean},
        @ConnectedSocket() client: Socket,
    ) {
        this.playerService.create(payload.username, client.id);
        client.broadcast.emit('userJoined', { name: this.playerService.getPlayerName(client.id), newUser: payload.newUser });
    }

    //NOTIFY THAT USER IS TYPING
    @SubscribeMessage('typing')
    async typing(
        @MessageBody('isTyping') isTyping: boolean,
        @ConnectedSocket() client: Socket,
    ) {
            const name = await this.playerService.getPlayerName(client.id);
            client.broadcast.emit('typing', { name, isTyping });
        }

    //LEAVE ROOM
    @SubscribeMessage('leave')
    leaveRoom(
        @MessageBody('name') name: string,
        @MessageBody('hasLeft') newUser: boolean,
        @ConnectedSocket() client: Socket,
    ) {
            client.broadcast.emit('userLeft', { name, hasLeft: true});
            this.playerService.delete(client.id);
        }
}
