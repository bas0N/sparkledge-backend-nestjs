import { IsNotEmpty } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  universityId: number;
}
