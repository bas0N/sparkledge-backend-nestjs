import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { University, Faculty, Programme, Course } from '.prisma/client';
import { InfrastructureService } from './infrastructure.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUniversityDto } from './dto/CreateUniversity.dto';
import { CreateFacultyDto } from './dto/createFaculty.dto';
import { CreateProgrammeDto } from './dto/createProgramme.dto';
import { CreateCourseDto } from './dto/createCourse.dto';
@ApiTags('infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(private infrastructureService: InfrastructureService) {}

  @Post('university')
  addUniversity(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<University> {
    return this.infrastructureService.addUniversity(createUniversityDto);
  }
  @Post('faculty')
  addFaculty(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.infrastructureService.addFaculty(createFacultyDto);
  }

  @Post('programme')
  addProgramme(
    @Body() createProgrammeDto: CreateProgrammeDto,
  ): Promise<Programme> {
    return this.infrastructureService.addProgramme(createProgrammeDto);
  }

  @Post('course')
  addCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.infrastructureService.addCourse(createCourseDto);
  }

  @Get('universities')
  getUniversities(): Promise<University[]> {
    return this.infrastructureService.getUniversities();
  }

  @ApiParam({
    name: 'universityId',
    description: 'Id of the university to which retrieved faculties belong.',
  })
  @Get('faculties/:universityId')
  getFaculties(@Param() universityId: string): Promise<Faculty[]> {
    return this.infrastructureService.getFaculties(universityId);
  }

  @ApiParam({
    name: 'facultyId',
    description: 'Id of the faculty to which retrieved programmes belong.',
  })
  @Get('programmes/:facultyId')
  getProgrammes(@Param() facultyId: string): Promise<Programme[]> {
    return this.infrastructureService.getProgrammes(facultyId);
  }

  @ApiParam({
    name: 'programmeId',
    description: 'Id of the programme to which retrieved courses belong.',
  })
  @Get('courses/:programmeId')
  getCourses(@Param() programmeId: string): Promise<Course[]> {
    return this.infrastructureService.getCourses(programmeId);
  }
}
