import { WebSocketGateway, 
        SubscribeMessage,
        MessageBody,
        ConnectedSocket,
        WebSocketServer} from '@nestjs/websockets';
import { PlayerService } from 'src/player/player.service';
import { ChannelService } from 'src/channel/channel.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChatmessageService } from 'src/chatmessage/chatmessage.service';
import { CreateChatmessageDto } from 'src/chatmessage/dto/create-chatmessage.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
import { CreateChannelmemberDto } from 'src/channelmember/dto/create-channelmember.dto';

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

    afterInit(client: Socket) {
        
        this.logger.log('After init!!');
    }

    async handleConnection(@ConnectedSocket() client: Socket){
        this.logger.log(`client ${client.handshake.auth.playerId} (${client.handshake.auth.username._value}) connected at ${client.id}`);
    }

    handleDisconnect(@ConnectedSocket() client: Socket){
      this.logger.log(`client disconnected ${client.id}`);
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
        @MessageBody() createChatmessageDto: CreateChatmessageDto,
        @ConnectedSocket() client: Socket
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
            const id = await this.playerService.findIdByUsername(payload.channelmember_name);
            if (!id)
                throw new Error('Player does not exist');

            const member: CreateChannelmemberDto = {
                member_id: id,
                channel_id: payload.channel_id,
                is_admin: false,
                is_muted: false,
                is_banned: false
            }

            const newChannelmember = await this.channelmemberService.createChannelmember(member);
            if (!newChannelmember)
                throw new Error('Player is already member of this channel');

            const intra_username = await this.playerService.findIntraByUsername(payload.channelmember_name);
            this.server.to(intra_username).emit('newChannel', member.channel_id);
            
            const channel = await this.channelService.findOneChannel(member.channel_id);
            this.server.to(channel.name).emit('newChannelmember', payload.channelmember_name);
            return member;
        } catch (error) {
            console.log('Error: ', error);
            return null
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
            console.log('client joined all rooms');
            console.log(client.rooms);
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
}

