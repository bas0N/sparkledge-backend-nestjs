import { IsNotEmpty } from 'class-validator';
import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export class ChangeDefaultSearchDto {
  @IsNotEmpty()
  universityId: string;
  @IsNotEmpty()
  facultyId: string;
  @IsNotEmpty()
  programmeId: string;
  @IsNotEmpty()
  courseId: string;
  @IsNotEmpty()
  sortPropety: SortPropety;
  @IsNotEmpty()
  sortValue: SortValue;
  @IsNotEmpty()
  degree: Degree;
  @IsNotEmpty()
  courseType: CourseType;
  @IsNotEmpty()
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
