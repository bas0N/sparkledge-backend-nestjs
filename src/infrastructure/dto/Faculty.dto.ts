import { IsNotEmpty } from 'class-validator';

export class FacultyDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  universityId: number;
}
