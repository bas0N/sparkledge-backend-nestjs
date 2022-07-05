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
    return this.prismaService.course.create({
      data: {
        name,
        semester: Number(semester),
        university: { connect: { id: Number(universityId) } },
        faculty: { connect: { id: Number(facultyId) } },
        programme: { connect: { id: Number(programmeId) } },
      },
    });
  }
  async getUniversities() {
    return this.prismaService.university.findMany();
  }
  async getFaculties(universityId: string) {
    return this.prismaService.faculty.findMany({
      where: { universityId: Number(universityId) },
    });
  }
  async getProgrammes(facultyId: string) {
    return this.prismaService.programme.findMany({
      where: { facultyId: Number(facultyId) },
    });
  }
  async getCourses(programmeId: string) {
    return this.prismaService.course.findMany({
      where: { programmeId: Number(programmeId) },
    });
  }
}
