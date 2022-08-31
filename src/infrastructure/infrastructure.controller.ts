import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { University, Faculty, Programme, Course } from '.prisma/client';
import { InfrastructureService } from './infrastructure.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUniversityDto } from './dto/createUniversity.dto';
import { CreateFacultyDto } from './dto/CreateFaculty.dto';
import { CreateProgrammeDto } from './dto/CreateProgramme.dto';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { AuthGuard } from '@nestjs/passport';
import { CourseDto } from './dto/Course.dto';
import { FacultyDto } from './dto/Faculty.dto';
import { ProgrammeDto } from './dto/Programme.to';
import { UniversityDto } from './dto/University.dto';
//import { EmailVerificationGuard } from 'src/authentication/authentication.guard';
@ApiTags('infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(private infrastructureService: InfrastructureService) {}
  @UseGuards(AuthGuard('jwt'))
  //@UseGuards(EmailVerificationGuard)
  @Post('university')
  addUniversity(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<University> {
    return this.infrastructureService.addUniversity(createUniversityDto);
  }

  @UseGuards(AuthGuard('jwt'))
  //@UseGuards(EmailVerificationGuard)
  @Post('faculty')
  addFaculty(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.infrastructureService.addFaculty(createFacultyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  //@UseGuards(EmailVerificationGuard)
  @Post('programme')
  addProgramme(
    @Body() createProgrammeDto: CreateProgrammeDto,
  ): Promise<Programme> {
    return this.infrastructureService.addProgramme(createProgrammeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  //@UseGuards(EmailVerificationGuard)
  @Post('course')
  addCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.infrastructureService.addCourse(createCourseDto);
  }

  @ApiOkResponse({ type: UniversityDto })
  @Get('universities')
  getUniversities(): Promise<University[]> {
    return this.infrastructureService.getUniversities();
  }

  @ApiOkResponse({ type: FacultyDto })
  @ApiParam({
    name: 'universityId',
    description: 'Id of the university to which retrieved faculties belong.',
  })
  @Get('faculties/:universityId')
  getFaculties(
    @Param('universityId') universityId: string,
  ): Promise<FacultyDto[]> {
    return this.infrastructureService.getFaculties(universityId);
  }

  @ApiOkResponse({ type: ProgrammeDto })
  @ApiParam({
    name: 'facultyId',
    description: 'Id of the faculty to which retrieved programmes belong.',
  })
  @Get('programmes/:facultyId')
  getProgrammes(
    @Param('facultyId') facultyId: string,
  ): Promise<ProgrammeDto[]> {
    return this.infrastructureService.getProgrammes(facultyId);
  }

  @ApiOkResponse({ type: CourseDto })
  @ApiParam({
    name: 'programmeId',
    description: 'Id of the programme to which retrieved courses belong.',
  })
  @Get('courses/:programmeId')
  getCourses(@Param('programmeId') programmeId: string): Promise<CourseDto[]> {
    return this.infrastructureService.getCourses(programmeId);
  }
}
