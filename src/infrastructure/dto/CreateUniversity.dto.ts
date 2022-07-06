import { IsNotEmpty } from 'class-validator';

export class CreateUniversityDto {
  @IsNotEmpty()
  name: string;
}
