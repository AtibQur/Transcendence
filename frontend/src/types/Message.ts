interface Message {
    content: string;
    sender_id: number;
    channel_id: number;
    channel: {
        name: string;
    };
    sender: {
      username: string;
    };
}

export default Message;