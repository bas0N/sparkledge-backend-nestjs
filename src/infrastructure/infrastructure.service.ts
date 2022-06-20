import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { University, Faculty, Programme, Course } from '.prisma/client';

@Injectable()
export class InfrastructureService {
  constructor(private readonly prismaService: PrismaService) {}
  addUniversity({ name }: University) {
    return this.prismaService.university.create({ data: { name } });
  }
  addFaculty({ name, universityId }: Faculty) {
    universityId = Number(universityId);
    return this.prismaService.faculty.create({
      data: { name, university: { connect: { id: universityId } } },
    });
  }

  addProgramme({ name, universityId, facultyId }: Programme) {
    universityId = Number(universityId);
    facultyId = Number(facultyId);
    return this.prismaService.programme.create({
      data: {
        name,
        university: { connect: { id: universityId } },
        faculty: { connect: { id: facultyId } },
      },
    });
  }
  addCourse({ name, semester, universityId, facultyId, programmeId }: Course) {
    universityId = Number(universityId);
    facultyId = Number(facultyId);
    +programmeId;
    return this.prismaService.course.create({
      data: {
        name,
        semester,
        university: { connect: { id: universityId } },
        faculty: { connect: { id: facultyId } },
        programme: { connect: { id: programmeId } },
      },
    });
  }
}
