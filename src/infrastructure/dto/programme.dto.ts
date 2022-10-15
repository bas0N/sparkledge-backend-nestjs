import { IsNotEmpty } from 'class-validator';

export class ProgrammeDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  facultyId: number;
  @IsNotEmpty()
  universityId: number;
}
