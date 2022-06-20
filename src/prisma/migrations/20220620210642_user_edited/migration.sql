-- AlterTable
ALTER TABLE "User" ALTER COLUMN "temporaryToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL;
