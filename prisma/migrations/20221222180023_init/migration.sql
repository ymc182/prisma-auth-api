-- CreateTable
CREATE TABLE "Discord_Users" (
    "discord_id" TEXT NOT NULL,
    "near_wallet" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "Discord_Users_discord_id_key" ON "Discord_Users"("discord_id");
