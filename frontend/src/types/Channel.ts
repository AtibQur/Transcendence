interface Channel {
    name: string,
    password?: string,
    is_private: boolean,
    owner_id: number
}

export default Channel;