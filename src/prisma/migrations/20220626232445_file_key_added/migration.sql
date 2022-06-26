/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileKey` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "fileKey" TEXT NOT NULL;

-- DropTable
DROP TABLE "File";
