import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { University, Faculty, Programme, Course } from '.prisma/client';
import { InfrastructureService } from './infrastructure.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(
    private readonly prismaService: PrismaService,
    private infrastructureService: InfrastructureService,
  ) {}

  /*
  @Get()
  findAllUniversities(): Promise<UniversityDto> {
    return this.prismaService.university.findMany();
  }
  */
  @Post('university')
  addUniversity(@Body() university: University): Promise<University> {
    return this.infrastructureService.addUniversity(university);
  }
  @Post('faculty')
  addFaculty(@Body() faculty: Faculty): Promise<Faculty> {
    return this.infrastructureService.addFaculty(faculty);
  }

  @Post('programme')
  addProgramme(@Body() programme: Programme): Promise<Programme> {
    return this.infrastructureService.addProgramme(programme);
  }

  @Post('course')
  addCourse(@Body() course: Course): Promise<Course> {
    return this.infrastructureService.addCourse(course);
  }
  @Get('universities')
  getUniversities() {
    return this.infrastructureService.getUniversities();
  }

  @Get('faculties/:id')
  getFaculties(@Param('id') universityId: string) {
    return this.infrastructureService.getFaculties(universityId);
  }
  @Get('programmes/:id')
  getProgrammes(@Param('id') facultyId: string) {
    return this.infrastructureService.getProgrammes(facultyId);
  }
  @Get('courses/:id')
  getCourses(@Param('id') programmeId: string) {
    return this.infrastructureService.getCourses(programmeId);
  }
}
