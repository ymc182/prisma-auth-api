/*
  Warnings:

  - You are about to drop the column `private_key` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "private_key",
ALTER COLUMN "public_key" DROP NOT NULL,
ALTER COLUMN "public_key" DROP DEFAULT;
