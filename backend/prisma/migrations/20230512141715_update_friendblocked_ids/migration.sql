/*
  Warnings:

  - You are about to drop the column `blocked_by_id` on the `BlockedPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `friend_id` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `player_id` to the `BlockedPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlockedPlayer" DROP CONSTRAINT "BlockedPlayer_blocked_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friend_id_fkey";

-- AlterTable
ALTER TABLE "BlockedPlayer" DROP COLUMN "blocked_by_id",
ADD COLUMN     "player_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friend_id",
ADD COLUMN     "player_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BlockedPlayer" ADD CONSTRAINT "BlockedPlayer_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
