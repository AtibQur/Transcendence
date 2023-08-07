import { Injectable } from '@nestjs/common';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PlayerService } from 'src/player/player.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';

const prisma = PrismaService.getClient();

@Injectable()
export class FriendService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly blockedplayerService: BlockedplayerService
  ) {}

  // ADD OTHER PLAYER AS FRIEND
  async addFriend(id: number, addFriendDto: AddFriendDto) {
    try {
      const friendId = await this.playerService.findIdByUsername(addFriendDto.friendUsername);
      if (!friendId)
        throw new Error("Cannot become friend because player does not exist");
      if (id == friendId) {
        throw new Error("You can not add yourself as a friend");
      }
      const existingFriendship = await this.isExistingFriendship(id, friendId);
      if (existingFriendship) {
        throw new Error("Player is already your friend");
      }
      if (await this.blockedplayerService.isBlocked(id, addFriendDto.friendUsername)) {
        await this.blockedplayerService.unblockPlayer(id, {blockedUsername: addFriendDto.friendUsername});
      }
      const playerUsername = await this.playerService.findOneUsername(id);
      if (await this.blockedplayerService.isBlocked(friendId, playerUsername)) {
        throw new Error("Player blocked you");
      }
      const newFriendShip = await prisma.friend.create({
        data: {
          player_id: id,
          friend_id: friendId,
        },
      });
      const numFriendsPlayer = await this.findNumFriends(id);
      await this.playerService.updateAchievementsAfterFriendAdd(id, numFriendsPlayer);
      const numFriendsFriend = await this.findNumFriends(friendId);
      await this.playerService.updateAchievementsAfterFriendAdd(friendId, numFriendsFriend);

      return newFriendShip;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

    // CHECK IF FRIENDSHIP EXISTS
    async isExistingFriendship(id: number, friendId: number) {
        try {
            if (await this.findFriendshipId(id, friendId))
                return true;
            else
                return false;
        }
        catch (error) {
            return false;
        }
    }

  // GET A FRIENDSHIP ID
  async findFriendshipId(id: number, friendId: number) {
    try {
        if (id == friendId)
            return null;
        const friendship = await prisma.friend.findFirst( {
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
      return friendship.id;
    }
    catch (error) {
      if (error.code === 'P2001')
          console.error('Friendship does not exist');
      else
          console.error('Error occured: ', error);
      return null;
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
    }
    catch (error) {
      console.error('Error occurred: ', error);
      return null;
    }
  }

  // GET AMOUNT OF FRIENDS
  async findNumFriends(id: number) {
    try {
      const friends = await this.findFriends(id);
      return Object.keys(friends).length;
    }
    catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

// FIND FRIENDS USERNAME AND STATUS
async findFriendsUsername(id: number) {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { player_id: id },
          { friend_id: id }
        ]
      },
      include: {
        player: {
          select: {
            username: true,
            player_stats: {
              select: {
                status: true,
              },
            },
          },
        },
        friend: {
          select: {
            username: true,
            player_stats: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const filteredFriends = friends.map((friend) => {
      if (friend.player_id === id) {
        return {
          username: friend.friend.username,
          status: friend.friend.player_stats.status,
        };
      } else {
        return {
          username: friend.player.username,
          status: friend.player.player_stats.status,
        };
      }
    });

    return filteredFriends;
  }
  catch (error) {
    console.error('Error occurred: ', error);
    return null;
  }
}

  // DELETE A FRIENDSHIP
  async remove(id: number, updateFriendDto: UpdateFriendDto) {
    try {
        const friendId = await this.playerService.findIdByUsername(updateFriendDto.friendUsername);
        if (!friendId)
          throw new Error("Player does not exist");
        const friendshipId = await this.findFriendshipId(id, friendId);
        if (!friendshipId)
            throw new Error("Friendship does not exist");

        const deletedFriendship = await prisma.friend.delete({
            where: {
                id: friendshipId
            },
        })
        return deletedFriendship;
    }
    catch (error) {
        console.error('Error occured: ', error);
        return null;
    }
  }

}