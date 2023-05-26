export class CreateChannelmemberDto {
    member_id: number;
    channel_id: number;
    is_admin?: boolean;
    is_muted?: boolean;
    is_banned?: boolean;
    added_at?: Date;
    muted_at?: Date;
  }
