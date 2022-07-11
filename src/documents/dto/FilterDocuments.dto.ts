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
  sortPropety: SortPropety;
  @IsOptional()
  sortValue: SortValue;
  @IsOptional()
  degree: Degree;
  @IsOptional()
  courseType: CourseType;
  @IsOptional()
  semester: string;
}

enum SortValue {
  asc,
  desc,
}

enum SortPropety {
  createdAt,
  title,
  viewsNumber,
  likesNumber,
}
