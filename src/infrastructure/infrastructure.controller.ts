import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { University, Faculty, Programme, Course } from '.prisma/client';
import { InfrastructureService } from './infrastructure.service';

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
  @Post('/university')
  addUniversity(@Body() university: University): Promise<University> {
    return this.infrastructureService.addUniversity(university);
  }
  @Post('/faculty')
  addFaculty(@Body() faculty: Faculty): Promise<Faculty> {
    return this.infrastructureService.addFaculty(faculty);
  }

  @Post('/programme')
  addProgramme(@Body() programme: Programme): Promise<Programme> {
    return this.infrastructureService.addProgramme(programme);
  }

  @Post('/course')
  addCourse(@Body() course: Course): Promise<Course> {
    return this.infrastructureService.addCourse(course);
  }
}
