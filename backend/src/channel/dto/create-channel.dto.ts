export class CreateChannelDto {
    name: string;
    password?: string;
    is_private: boolean;
    owner_id: number;
}
