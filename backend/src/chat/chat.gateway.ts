import { WebSocketGateway, 
        SubscribeMessage,
        MessageBody,
        ConnectedSocket,
        WebSocketServer } from '@nestjs/websockets';
import { PlayerService } from 'src/player/player.service';
import { ChannelService } from 'src/channel/channel.service';
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
export class ChatGateway {
  @WebSocketServer()
  server: Server;

    constructor(
        private readonly playerService: PlayerService,
        private readonly channelmemberService: ChannelmemberService,
        private readonly channelService: ChannelService,
        private readonly chatmessageService: ChatmessageService
    ) {}

    private logger = new Logger('ChatGateway');

    handleConnection(@ConnectedSocket() client: Socket){
      this.logger.log(`client connected ${client.id}`)
    }

    handleDisconnect(@ConnectedSocket() client: Socket){
      this.logger.log(`client disconnected ${client.id}`)
    }

    //ADD MESSAGE
    @SubscribeMessage('addChannel')
    async addChannel(
        @MessageBody() createChannelDto: CreateChannelDto,
        @ConnectedSocket() client: Socket
    ){
        try {
            const channel_id = await this.channelService.createChannel(createChannelDto);
            client.join(createChannelDto.name);
            this.server.emit('newChannel', { channel_id: channel_id } );
            return channel_id;
        } catch (error) {
            console.log('Error creating channel: ', error);
        }
    }

    //ADD MESSAGE
    @SubscribeMessage('addChatmessage')
    async addMessage(
        @MessageBody() createChatmessageDto: CreateChatmessageDto
    ){
        const chatmessage = await this.chatmessageService.createChatMessage(createChatmessageDto);
        this.server.to(chatmessage.channel.name).emit('chatmessage', chatmessage);
        return chatmessage;
    }

    //ADD CHANNELMEMBER
    @SubscribeMessage('addChannelmember')
    async addChannelmember(
        @MessageBody() payload: {channelmember_name: string, channel_id: number}
    ) {
        try {
            const data = await this.playerService.findInfoAddChannelmember(payload.channelmember_name, payload.channel_id);
            if (!data)
                throw new Error;
            this.server.to(data.intra_username).emit('newChannel', payload.channel_id);
            return ;
        } catch (error) {
            console.log('Error adding channelmember: ', error);
            return 'Player does not exist';
        }
    }

    //JOIN A ROOM
    @SubscribeMessage('joinRoom')
    async joinRoom(
        @MessageBody() payload: {player_id: number, channel_id: number},
        @ConnectedSocket() client: Socket
    ) {
        try {
            //!!! now able to create identical channelmembers.. should be unique?!
            await this.channelmemberService.createChannelmember({ member_id: payload.player_id, channel_id: payload.channel_id});
            const channel = await this.channelService.findOneChannel(payload.channel_id);
            client.join(channel.name);
            console.log('joined');
            return ;
        } catch (error) {
            console.log('Error joining channels: ', error);
        }
    }

    //JOIN ALL ROOMS OF PLAYER
    @SubscribeMessage('joinAllRooms')
    async joinAllRooms(
        @MessageBody() player_id: number,
        @ConnectedSocket() client: Socket
    ) {
        try {
            const channels = await this.channelmemberService.findPlayerChannels(player_id);
            channels.forEach(function(channel) {
                client.join(channel.channel.name);
              });
            const intra_username = await this.playerService.findOneIntraUsername(player_id);
            client.join(intra_username);
            console.log('client joined to intraname: ', intra_username);
        } catch (error) {
            console.log('Error joining channels: ', error);
        }
    }

    //FIND ALL ONLINE PLAYERS
    @SubscribeMessage('findAllOnlinePlayers')
    findAllOnlinePlayers(){
        return this.playerService.findAllOnlinePlayers();
    }

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
        try {
            const channel = await this.channelService.findOneChannel(channelId);
            return channel.name;
        } catch (error) {
            console.log('Error finding channel name: ', error);
        }
    }

    // FIND ALL MEMBERS OF CHANNEL
    @SubscribeMessage('findAllChannelmembersNames')
    async findAllChannelmembers (
        @MessageBody() channelId: number
    ) {
        try {
            const channelmembers = await this.channelmemberService.findAllChannelmembersNames(channelId);
            const names = [];

            channelmembers.forEach(function(channelmember) {
                names.push(channelmember.member.username);
              });
            
            return names;
        } catch (error) {
            console.log('Error finding channel members: ', error);
        }
    }

    // //FIND ALL CHANNEL MESSAGES
    // @SubscribeMessage('findAllChannelMessages')
    // findAllChannelMessages(
    //     @MessageBody() id: number
    // ){
    //     return this.chatmessageService.findChannelMsgs(id);
    // }

    // //FIND ALL CHANNEL MESSAGES FILTERED
    // @SubscribeMessage('findAllChannelMessagesFiltered')
    // findAllChannelMessagesFiltered(){
    //     return this.chatmessageService.findChannelMsgsFiltered();
    // }

    //FIND NAME OF MESSAGESENDER
    @SubscribeMessage('findUsername')
    findUserName(
        @MessageBody() id: number
    ){
        return this.playerService.findOneUsername(id);
    }
}

