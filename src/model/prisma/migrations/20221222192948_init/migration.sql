/*
  Warnings:

  - You are about to drop the `Discord_Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Discord_Users";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Users" (
    "discord_id" TEXT NOT NULL,
    "wallet_id" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "password_hash" TEXT NOT NULL DEFAULT '',
    "private_key" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "public_key" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("discord_id")
);

-- CreateTable
CREATE TABLE "UserItems" (
    "discord_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userItemsDiscord_id" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_discord_id_key" ON "Users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserItems_discord_id_key" ON "UserItems"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Items_id_key" ON "Items"("id");

-- AddForeignKey
ALTER TABLE "UserItems" ADD CONSTRAINT "UserItems_discord_id_fkey" FOREIGN KEY ("discord_id") REFERENCES "Users"("discord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_userItemsDiscord_id_fkey" FOREIGN KEY ("userItemsDiscord_id") REFERENCES "UserItems"("discord_id") ON DELETE SET NULL ON UPDATE CASCADE;
