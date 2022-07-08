import { IsOptional, Max, Min } from 'class-validator';
import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export class FilterDocumentsDto {
  @IsOptional()
  universityId: string;
  @IsOptional()
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
  @IsOptional()
  @Min(0)
  @Max(10)
  semester: string;
}
