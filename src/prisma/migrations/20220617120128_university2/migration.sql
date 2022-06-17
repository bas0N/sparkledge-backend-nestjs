/*
  Warnings:

  - The primary key for the `University` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `University` table. All the data in the column will be lost.
  - The required column `universityId` was added to the `University` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "University" DROP CONSTRAINT "University_pkey",
DROP COLUMN "id",
ADD COLUMN     "universityId" TEXT NOT NULL,
ADD CONSTRAINT "University_pkey" PRIMARY KEY ("universityId");

-- CreateTable
CREATE TABLE "Faculty" (
    "facultyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("facultyId")
);
