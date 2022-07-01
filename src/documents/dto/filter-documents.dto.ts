import { IsNumber, IsOptional } from 'class-validator';

export class FilterDocumentsDto {
  //  @IsNumber()
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
