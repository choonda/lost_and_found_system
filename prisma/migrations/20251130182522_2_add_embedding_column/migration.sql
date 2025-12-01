-- AlterTable: Drop the imageHash column and add the embedding column
ALTER TABLE "item" 
    ADD COLUMN "embedding" vector(768);