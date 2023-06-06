import { WebSocketGateway, 
        SubscribeMessage,
        MessageBody, 
        WebSocketServer, 
        ConnectedSocket,
        OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect, } from '@nestjs/websockets';
import { PlayerService } from 'src/player/player.service';
import { ChannelService } from 'src/channel/channel.service';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChatmessageService } from 'src/chatmessage/chatmessage.service';
import { CreateChatmessageDto } from 'src/chatmessage/dto/create-chatmessage.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})
export class ChatGateway { //implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

    constructor(
        // private readonly messageService: MessageService,
        private readonly playerService: PlayerService,
        private readonly channelmemberService: ChannelmemberService,
        private readonly channelService: ChannelService,
        private readonly chatmessageService: ChatmessageService
    ) {}
    private logger = new Logger('ChatGateway');

    // handleConnection(@ConnectedSocket() client: Socket){
    //   this.logger.log(`client connected ${client.id}`)
    // }

    // handleDisconnect(@ConnectedSocket() client: Socket){
    //   this.logger.log(`client disconnected ${client.id}`)
    // }

    //ADD PLAYER
    @SubscribeMessage('addPlayer')
    async addPlayer(
        @MessageBody() createPlayerDto: CreatePlayerDto
    ){
        const player_id = await this.playerService.createPlayer(createPlayerDto);
        this.server.emit('player', player_id);
        return player_id;
    }

    @SubscribeMessage('addChannel')
    async addChannel(
        @MessageBody() createChannelDto: CreateChannelDto
    ){
        const channel_id = await this.channelService.createChannel(createChannelDto);
        this.server.emit('newChannel', { channel_id: channel_id } );
        return channel_id;
    }

    //ADD MESSAGE
    @SubscribeMessage('addChatmessage')
    async addMessage(
        @MessageBody() createChatmessageDto: CreateChatmessageDto
    ){
        const chatmessage_id = await this.chatmessageService.createChatMessage(createChatmessageDto);
        this.server.emit('chatmessage', chatmessage_id);
        return chatmessage_id;
    }

    //FIND ALL ONLINE PLAYERS
    // @SubscribeMessage('findAllOnlinePlayers')
    // findAllOnlinePlayers(){
    //     return this.playerService.findAllStats();
    // }

    //FIND ALL CHANNEL NAMES OF PLAYER
    @SubscribeMessage('findPlayerChannels')
    findPlayerChannels(
        @MessageBody() id: number
    ){
        return this.channelmemberService.findPlayerChannels(id);
    }

    //FIND ONE CHANNEL NAME
    @SubscribeMessage('findOneChannelName')
    async findOneChannelName (
        @MessageBody() channelId: number
    ){
        const channel = await this.channelService.findOneChannel(channelId);
        // console.log(channel);
        return channel.name;
    }

    //FIND ALL CHANNEL MESSAGES
    @SubscribeMessage('findAllChannelMessages')
    findAllChannelMessages(
        @MessageBody() id: number
    ){
        return this.chatmessageService.findChannelMsgs(id);
    }

    //FIND NAME OF MESSAGESENDER
    @SubscribeMessage('findUsername')
    findUserName(
        @MessageBody() id: number
    ){
        return this.playerService.findOneUsername(id);
    }

    // @SubscribeMessage('findAllChannelMessages')
    // findAllChannelMessages(
    //     @MessageBody() payload: { channelName: string}
    // ){
    //     return this.messageService.findAllChannelMessages(payload.channelName);
    // }

    // @SubscribeMessage('join')
    // joinChannel(
    //     @MessageBody() payload: { playerName: string, channelName: string},
    //     @ConnectedSocket() client: Socket
    // ){
    //     client.join(payload.channelName);
    //     console.log(payload.playerName, ' joins ', payload.channelName);
    //     return true;
    //     // client.broadcast.emit('userJoined', payload.playerName);
    // }
}

