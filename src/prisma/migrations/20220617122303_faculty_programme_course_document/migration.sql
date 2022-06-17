-- CreateTable
CREATE TABLE "Programme" (
    "programmeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("programmeId")
);

-- CreateTable
CREATE TABLE "Course" (
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "facultyId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "Document" (
    "documentId" TEXT NOT NULL,
    "s3key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("documentId")
);
