import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UniversityDto } from './university.dto';

@Controller('infrastructure')
export class InfrastructureController {
  constructor(private readonly prismaService: PrismaService) {}

  /*
  @Get()
  findAllUniversities(): Promise<UniversityDto> {
    return this.prismaService.university.findMany();
  }
  */
  @Post()
  addUniversity(@Body() { name }: UniversityDto): Promise<UniversityDto> {
    return this.prismaService.university.create({ data: { name } });
  }
}
