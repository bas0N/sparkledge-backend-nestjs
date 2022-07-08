import { IsNotEmpty, IsOptional } from 'class-validator';
import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export class FilterDocumentsDto {
  @IsNotEmpty()
  universityId: string;
  @IsNotEmpty()
  facultyId: string;
  @IsOptional()
  programmeId: string;
  @IsOptional()
  courseId: string;
  @IsOptional()
  sort: string;
  @IsOptional()
  degree: Degree;
  @IsOptional()
  courseType: CourseType;
  @IsOptional()
  semester: string;
}
