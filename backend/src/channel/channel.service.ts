import { Injectable } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
	channels: Channel[] = [
		{ id: 'channel001', name: 'Channel 1', messages: [] },
		{ id: 'channel002', name: 'Channel 2', messages: [] }
	]

	create(createChannelDto: CreateChannelDto, channelId: string) {
		const channel = {
			id: channelId,
			name: createChannelDto.name,
			messages: [],
		};
		this.channels.push(channel);
		console.log(this.channels);
		return channel;
	}

	delete(channelId: string) {
        const index = this.channels.findIndex(channel => channel.id === channelId);

        if (index !== -1) {
            this.channels.splice(index, 1);
        }
	}

	getChannelName(channelId: string) {
        const index = this.channels.findIndex(channel => channel.id === channelId);

        if (index !== -1) {
            return this.channels[index].name;
        }
        return ('Error: channel not found');
	}
}
