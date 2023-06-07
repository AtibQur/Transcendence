import { Injectable } from '@nestjs/common';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PlayerService } from 'src/player/player.service';
import { PrismaService } from '../../prisma/prisma.service';

const prisma = PrismaService.getClient();

@Injectable()
export class FriendService {
  constructor(
    private readonly playerService: PlayerService
  ) {}

  async addFriend(id: number, addFriendDto: AddFriendDto) {
    try {
      const friendId = await this.playerService.findIdByUsername(addFriendDto.friendUsername);
      
      // Check if the friendship already exists
      const existingFriendship = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              player_id: id,
              friend_id: friendId,
            },
            {
              player_id: friendId,
              friend_id: id,
            },
          ],
        },
      });
      
      if (existingFriendship) {
        return "This user is already your friend.";
      }
      
      const newFriend = await prisma.friend.create({
        data: {
          player_id: id,
          friend_id: friendId,
        },
      });
      
      return `Friend added: ${addFriendDto.friendUsername}`;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  findAll() {
    return `This action returns all friend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
