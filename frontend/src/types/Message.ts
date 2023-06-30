interface Message {
    id: number;
    content: string;
    sender_id: number;
    channel_id: number;
    sent_at: Date;
    sender: {
      username: string;
    };
    channel: {
      name: string;
    };
  }

export default Message;