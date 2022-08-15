-- DropIndex
DROP INDEX "Comment_documentId_key";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);
