import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserNameSurnameDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
}
