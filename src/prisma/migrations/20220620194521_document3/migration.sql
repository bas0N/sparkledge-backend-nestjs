/*
  Warnings:

  - Added the required column `description` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "s3key" SET DEFAULT E'essa';
