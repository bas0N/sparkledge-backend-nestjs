import { IsNotEmpty, IsOptional } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  title: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  courseId: number;
  @IsNotEmpty()
  programmeId: number;
  @IsNotEmpty()
  facultyId: number;
  @IsNotEmpty()
  universityId: number;
  @IsNotEmpty()
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  fileId: number;
  @IsNotEmpty()
  viewsNumber: number;
  @IsNotEmpty()
  likesNumber: number;
  likesList: string[];
  @IsNotEmpty()
  createdAt: Date;
}
