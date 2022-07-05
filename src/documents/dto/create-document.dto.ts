import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  title: string;
  @IsOptional()
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
