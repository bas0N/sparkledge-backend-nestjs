import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacultyDto } from './dto/faculty.dto';
import { UniversityDto } from './dto/university.dto';

@Controller('infrastructure')
export class InfrastructureController {
  constructor(private readonly prismaService: PrismaService) {}

  /*
  @Get()
  findAllUniversities(): Promise<UniversityDto> {
    return this.prismaService.university.findMany();
  }
  */
  @Post('/university')
  addUniversity(@Body() { name }: UniversityDto): Promise<UniversityDto> {
    return this.prismaService.university.create({ data: { name } });
  }
  @Post('/faculty')
  addFaculty(@Body() { name, universityId }: FacultyDto): Promise<FacultyDto> {
    universityId = Number(universityId);
    return this.prismaService.faculty.create({
      data: { name, universityId },
    });
  }
}
