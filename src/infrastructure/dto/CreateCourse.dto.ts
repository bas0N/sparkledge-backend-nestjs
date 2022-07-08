import { IsNotEmpty } from 'class-validator';
import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export class CreateCourseDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  semester: number;
  @IsNotEmpty()
  programmeId: number;
  @IsNotEmpty()
  facultyId: number;
  @IsNotEmpty()
  universityId: number;
  @IsNotEmpty()
  courseType: CourseType;
  @IsNotEmpty()
  degree: Degree;
}
