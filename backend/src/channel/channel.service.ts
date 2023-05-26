import { Injectable } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
	channels: Channel[] = [
		{ name: "Channel 1" },
		{ name: "Channel 2" },
		{ name: "Channel 3" }
	]

	create(channelName: string) {
		const channel = {
			name: channelName,
		};
		if (this.channels.some(channel => channel.name === channelName)) {
            console.log('Channel already exists');
        } else {
            this.channels.push(channel);
            console.log('added channel: ', channel.name);
        }
		this.channels.push(channel);
		console.log(this.channels);
		return channel;
	}

	findAll() {
		return this.channels;
	}

	// delete(channelId: string) {
    //     const index = this.channels.findIndex(channel => channel.id === channelId);

    //     if (index !== -1) {
    //         this.channels.splice(index, 1);
    //     }
	// }

	// getChannelName(channelId: string) {
    //     const index = this.channels.findIndex(channel => channel.id === channelId);

    //     if (index !== -1) {
    //         return this.channels[index].name;
    //     }
    //     return ('Error: channel not found');
	// }
}
