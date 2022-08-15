import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  documentId: string;
  @IsOptional()
  content: string;
}
