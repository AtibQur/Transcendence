import { Message } from "src/message/entities/message.entity";
import { Player } from "src/player/entities/player.entity";

export class Channel {
	id: string;//number;
	name: string;
	// password: string;
	// is_private: boolean;
	// owner_id: number;
	// owner: Player;
	messages: Message[];
	// members: ChannelMember[];
}