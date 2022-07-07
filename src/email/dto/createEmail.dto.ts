import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsNotEmpty()
  recipent: string;
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
