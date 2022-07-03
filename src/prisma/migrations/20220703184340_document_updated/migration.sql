-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "likesList" TEXT[],
ADD COLUMN     "likesNumber" INTEGER NOT NULL DEFAULT 0;
