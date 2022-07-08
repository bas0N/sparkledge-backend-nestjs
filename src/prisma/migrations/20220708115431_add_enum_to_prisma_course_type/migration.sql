-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('FACULTATIVE', 'OBLIGATORY');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('BACHELOR', 'MASTER', 'PHD');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "courseType" "CourseType" NOT NULL DEFAULT 'OBLIGATORY',
ADD COLUMN     "degree" "Degree" NOT NULL DEFAULT 'BACHELOR';
