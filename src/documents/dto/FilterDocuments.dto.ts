import { IsOptional, Max, Min } from 'class-validator';

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
  @Min(0)
  @Max(10)
  semester: string;
}
