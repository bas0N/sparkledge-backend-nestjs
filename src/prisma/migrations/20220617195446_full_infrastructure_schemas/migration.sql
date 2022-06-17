/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseId` on the `Course` table. All the data in the column will be lost.
  - The primary key for the `Document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `documentId` on the `Document` table. All the data in the column will be lost.
  - The primary key for the `Faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `facultyId` on the `Faculty` table. All the data in the column will be lost.
  - The primary key for the `Programme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `programmeId` on the `Programme` table. All the data in the column will be lost.
  - The primary key for the `University` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `universityId` on the `University` table. All the data in the column will be lost.
  - Changed the type of `programmeId` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `facultyId` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `universityId` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `courseId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `programmeId` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `facultyId` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `universityId` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `universityId` on the `Faculty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `facultyId` on the `Programme` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `universityId` on the `Programme` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "courseId",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "programmeId",
ADD COLUMN     "programmeId" INTEGER NOT NULL,
DROP COLUMN "facultyId",
ADD COLUMN     "facultyId" INTEGER NOT NULL,
DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Document" DROP CONSTRAINT "Document_pkey",
DROP COLUMN "documentId",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "programmeId",
ADD COLUMN     "programmeId" INTEGER NOT NULL,
DROP COLUMN "facultyId",
ADD COLUMN     "facultyId" INTEGER NOT NULL,
DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL,
ADD CONSTRAINT "Document_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_pkey",
DROP COLUMN "facultyId",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL,
ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Programme" DROP CONSTRAINT "Programme_pkey",
DROP COLUMN "programmeId",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "facultyId",
ADD COLUMN     "facultyId" INTEGER NOT NULL,
DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL,
ADD CONSTRAINT "Programme_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "University" DROP CONSTRAINT "University_pkey",
DROP COLUMN "universityId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "University_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
