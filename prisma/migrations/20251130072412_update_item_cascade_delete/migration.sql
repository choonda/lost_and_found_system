-- DropForeignKey
ALTER TABLE "claim" DROP CONSTRAINT "claim_itemId_fkey";

-- DropForeignKey
ALTER TABLE "claim" DROP CONSTRAINT "claim_userId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_userId_fkey";

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
