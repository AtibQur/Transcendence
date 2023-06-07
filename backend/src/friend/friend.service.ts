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

  // ADD OTHER PLAYER AS FRIEND
  async addFriend(id: number, addFriendDto: AddFriendDto) {
    try {
      const friendId = await this.playerService.findIdByUsername(addFriendDto.friendUsername);
      if (id == friendId) {
        return "You can not add yourself as a friend! That's pathetic..";
      }
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
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }

  // GET A PLAYERS FRIENDS
  async findFriends(id: number) {
    try {
      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            { player_id: id },
            { friend_id: id }
          ]
        },
      });
      return friends;
    } catch (error) {
      console.error('Error occurred: ', error);
    }

    return `This action returns a #${id} friend`;
  }

  // DELETE A FRIENDSHIP
  async remove(id: number, updateFriendDto: UpdateFriendDto) {
    try {
      const friendId = await this.playerService.findIdByUsername(updateFriendDto.friendUsername);
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
      if (!existingFriendship) {
        return ('Friendship does not exist');
      }
      const deletedFriendship = await prisma.friend.delete({
        where: {
          id: existingFriendship.id
        },
      })
      return `This action removes friendship #${deletedFriendship.id}`;
    }
    catch (error) {
      console.error('Error occured: ', error);
    }
  }
}
