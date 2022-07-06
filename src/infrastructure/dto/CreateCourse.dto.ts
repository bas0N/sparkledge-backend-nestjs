import { IsNotEmpty } from 'class-validator';

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
}
