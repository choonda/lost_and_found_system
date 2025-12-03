/*
  Warnings:

  - You are about to drop the `Claim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoundItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kolej` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LostItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('LOOKING', 'FOUND', 'CLAIMED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('LOST', 'FOUND');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_foundId_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_lostId_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoundItem" DROP CONSTRAINT "FoundItem_centerId_fkey";

-- DropForeignKey
ALTER TABLE "FoundItem" DROP CONSTRAINT "FoundItem_finderId_fkey";

-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_userId_fkey";

-- DropTable
DROP TABLE "Claim";

-- DropTable
DROP TABLE "FoundItem";

-- DropTable
DROP TABLE "Kolej";

-- DropTable
DROP TABLE "LostItem";

-- CreateTable
CREATE TABLE "center" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "contact" TEXT,

    CONSTRAINT "center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" "ItemStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "date" TIMESTAMP(3),

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "found_item" (
    "itemId" TEXT NOT NULL,
    "centerId" INTEGER NOT NULL,

    CONSTRAINT "found_item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "claim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_userId_status_type_createdAt_idx" ON "item"("userId", "status", "type", "createdAt");

-- CreateIndex
CREATE INDEX "found_item_centerId_idx" ON "found_item"("centerId");

-- CreateIndex
CREATE INDEX "claim_userId_itemId_status_idx" ON "claim"("userId", "itemId", "status");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_item" ADD CONSTRAINT "found_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_item" ADD CONSTRAINT "found_item_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
