import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from '.prisma/client';
export class ChangeRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  role: Role;
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
