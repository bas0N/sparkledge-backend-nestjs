import { IsNotEmpty } from 'class-validator';

export class CreateProgrammeDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  facultyId: number;
  @IsNotEmpty()
  universityId: number;
}
