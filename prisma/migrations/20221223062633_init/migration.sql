/*
  Warnings:

  - You are about to drop the column `data` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `userItemsDiscord_id` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the `UserItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `encrypted_data` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_userItemsDiscord_id_fkey";

-- DropForeignKey
ALTER TABLE "UserItems" DROP CONSTRAINT "UserItems_discord_id_fkey";

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "data",
DROP COLUMN "userItemsDiscord_id",
ADD COLUMN     "discord_id" TEXT,
ADD COLUMN     "encrypted_data" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserItems";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_discord_id_fkey" FOREIGN KEY ("discord_id") REFERENCES "Users"("discord_id") ON DELETE SET NULL ON UPDATE CASCADE;
