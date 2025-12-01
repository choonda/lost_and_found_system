/*
  Warnings:

  - You are about to drop the column `status` on the `claim` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "claim_userId_itemId_status_idx";

-- AlterTable
ALTER TABLE "claim" DROP COLUMN "status",
ADD COLUMN     "centerId" INTEGER;

-- CreateIndex
CREATE INDEX "claim_userId_itemId_centerId_idx" ON "claim"("userId", "itemId", "centerId");

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;
