import { IsNotEmpty } from 'class-validator';

export class UniversityDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
}
