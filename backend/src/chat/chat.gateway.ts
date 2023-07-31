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
import { UpdateChannelmemberDto } from 'src/channelmember/dto/update-channelmember.dto';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:8080', // allow only from our frontend
	},
})
export class ChatGateway {
    @WebSocketServer() server: Server;
    
    constructor(
        private readonly playerService: PlayerService,
        private readonly channelmemberService: ChannelmemberService,
        private readonly channelService: ChannelService,
        private readonly chatmessageService: ChatmessageService,
        ) {}
        
    private logger = new Logger('ChatGateway');
    private connectedSockets: Map<string, string> = new Map<string, string>();

    //HANDLES NEW INCOMING SOCKET CONNECTION,
    // add user and socket id to map
    // and joins socket id to all rooms of player
    async handleConnection(@ConnectedSocket() client: Socket){
        // console.log('On connection:', client.handshake);
        const playerId = parseInt(client.handshake.auth.id);
        if (!playerId) //if nobody is logged in
        {
            console.log('nobody logged');
            client.disconnect();
        }
        else {
            console.log('logging...');
            const intra_username = await this.playerService.findOneIntraUsername(playerId);
            this.connectedSockets.set(intra_username, client.id)
            
            const channels = await this.channelmemberService.findAllPlayerRooms(playerId);
            channels.forEach(function(channel) {
                client.join(channel.channel_id.toString());
              });
            client.join(intra_username);

            console.log('client joined all rooms & dms');
            // console.log(client.rooms);
    
            console.log('connected sockets:', this.connectedSockets);
            
            this.playerService.updateStatus(playerId, { status: "online" });
            
            this.logger.log(`client ${playerId} (${intra_username}) connected at ${client.id}`);
        }
    }
    
    //HANDLES DISCONNECTION OF SOCKET AND REMOVES IT FROM MAP
    async handleDisconnect(@ConnectedSocket() client: Socket){
        const playerId = parseInt(client.handshake.auth.id);
        // console.log('On disconnection:', client.handshake);
        if (playerId)
        {
            console.log('logging off...');
            const intra_username = await this.playerService.findOneIntraUsername(playerId);
            this.connectedSockets.delete(intra_username);
            console.log('connected sockets:', this.connectedSockets);
            
            this.playerService.updateStatus(playerId, { status: "offline" });
            this.logger.log(`client ${playerId} (${intra_username}) disconnected ${client.id}`);
        }
        else
            console.log('close connection');
    }

    //ADD CHANNEL
    // returns channel_id on success
    // returns null on failure
    @SubscribeMessage('addChannel')
    async addChannel(
        @MessageBody() createChannelDto: CreateChannelDto,
        @ConnectedSocket() client: Socket
    ){
        try {
            const channel_id = await this.channelService.createChannel(createChannelDto);
            client.join(channel_id.toString());

            // this is needed because of the format of the channel display array (channels are fetch through channelmemberservice)
            const newChannel = await this.channelmemberService.findChannelmember(createChannelDto.owner_id, channel_id);
            this.server.to(client.id).emit('newChannel', newChannel);
            return channel_id;
        } catch (error) {
            console.log('Error creating channel: ', error);
            return null;
        }
    }

    @SubscribeMessage('addDm')
    async addDm(
        @MessageBody() payload: { player_id: number, friend_id: number },
        @ConnectedSocket() client: Socket
    ) {
        try {
            const dm_id = await this.channelService.createDm(payload.player_id, payload.friend_id);
            client.join(dm_id.toString());

            const playerUsername = await this.playerService.findOneUsername(payload.player_id);
            const friendUsername = await this.playerService.findOneIntraUsername(payload.friend_id);
            this.server.to(client.id).emit('newDm', {channel_id: dm_id, friend_username: friendUsername});
            this.server.to(friendUsername).emit('newDm', {channel_id: dm_id, friend_username: playerUsername});
            
            return dm_id;
        } catch (error) {
            console.log('Error adding dm: ', error);
            return null;
        }
    }

    //ADD MESSAGE
    // returns chatmessage object on success
    // returns null on failure
    @SubscribeMessage('addChatmessage')
    async addMessage(
        @MessageBody() createChatmessageDto: CreateChatmessageDto,
        @ConnectedSocket() client: Socket
    ){
        try {
            const chatmessage = await this.chatmessageService.createChatMessage(createChatmessageDto);
            this.server.to(chatmessage.channel_id.toString()).emit('chatmessage', chatmessage);
            return chatmessage;
        } catch (error) {
            console.log('Error creating message: ', error);
            return null;
        }
    }

    //ADD CHANNELMEMBER
    // returns channelmember_id on success
    // returns null on failure
    @SubscribeMessage('addChannelmember')
    async addChannelmember(
        @MessageBody() payload: {channelmember_name: string, channel_id: number, is_admin: boolean}
    ) {
        try {
            const id = await this.playerService.findIdByUsername(payload.channelmember_name);
            if (!id)
                throw new Error('Player does not exist');

            const member: CreateChannelmemberDto = {
                member_id: id,
                channel_id: payload.channel_id,
                is_admin: payload.is_admin,
                is_muted: false,
                is_banned: false
            }

            const newChannelmember = await this.channelmemberService.createChannelmember(member);
            if (!newChannelmember)
                throw new Error('Player is already member of this channel');

            const channel = await this.channelmemberService.findChannelmember(newChannelmember.member_id, newChannelmember.channel_id);
        
            //notify player of new channel
            this.server.to(channel.member.intra_username).emit('newChannel', channel);
            
            //notify channelmembers of new member --> toast does not work in socket.on
            this.server.to(channel.channel_id.toString()).emit('newChannelmember', {username: payload.channelmember_name, id: member.member_id});
            
            return newChannelmember.id;
        } catch (error) {
            console.log('Error: ', error);
            return null
        }
    }

    //JOIN A ROOM
    // returns true on success
    // returns false on failure
    @SubscribeMessage('joinRoom')
    async joinRoom(
        @MessageBody() payload: {playerId: number, channelId: number},
        @ConnectedSocket() client: Socket
    ) {
        try {
            if (!this.channelmemberService.isInChannel(payload.playerId, payload.channelId))
                throw new Error('player is not member of channel');
            
            client.join(payload.channelId.toString());

            const username = await this.playerService.findOneUsername(payload.playerId);
            this.logger.log(`${username} joined new room`);

            return true;
        } catch (error) {
            console.log('Error joining channels: ', error);
            return false;
        }
    }

    //LEAVE ROOM
    // returns deleted channelmember id on succes
    // returns null on failure
    @SubscribeMessage('leaveRoom')
    async leaveRoom(
        @MessageBody() payload: {player_id: number, channel_id: number},
        @ConnectedSocket() client: Socket
    ) {
        try {
            const member: UpdateChannelmemberDto = {
                member_id: payload.player_id,
                channel_id: payload.channel_id,
            }
            
            //added 'any' in order to resolve types error -> change to interface
            const deletedMember: any = await this.channelmemberService.remove(payload.player_id, member);
            if (!deletedMember)
                throw new Error();
            console.log(`player left the channel`);

            const channel = await this.channelService.findOneChannel(payload.channel_id);

            //update channel display for player
            this.server.to(client.id).emit('leftChannel', channel.name);

            //disconnect socket from room
            client.leave(channel.id.toString());

            //if member is owner, a new owner needs to be set
            if (deletedMember.is_owner)
                await this.channelService.setNewOwner(channel.id)

            //notify other channelmembers that a channelmember has left the channel
            this.server.to(channel.id.toString()).emit('removeChannelmember', deletedMember.member_id, channel.name);

            return deletedMember.member_id;
        } catch (error) {
            console.log('Error leaving room: ', error);
            return null;
        }
    }
}
