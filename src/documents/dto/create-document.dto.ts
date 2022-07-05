import { IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  courseId: string;
  @IsNotEmpty()
  programmeId: string;
  @IsNotEmpty()
  facultyId: string;
  @IsNotEmpty()
  universityId: string;
}
