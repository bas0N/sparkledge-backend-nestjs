import { IsNotEmpty } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  id: number;
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
}
