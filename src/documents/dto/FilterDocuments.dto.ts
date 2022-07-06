import { IsOptional } from 'class-validator';

export class FilterDocumentsDto {
  @IsOptional()
  universityId;
  @IsOptional()
  facultyId;
  @IsOptional()
  programmeId;
  @IsOptional()
  courseId;
  @IsOptional()
  sort;
}
