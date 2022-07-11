import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @IsNotEmpty()
  id: string;
  @IsOptional()
  title: string;
  @IsOptional()
  description: string;
}
