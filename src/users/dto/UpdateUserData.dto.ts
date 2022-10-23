import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDataDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsOptional()
  facebookUrl: string;
  @ApiProperty()
  @IsOptional()
  instagramUrl: string;
  @ApiProperty()
  @IsOptional()
  linkedinUrl: string;
  @ApiProperty()
  @IsOptional()
  pinterestUrl: string;
  @ApiProperty()
  @IsOptional()
  description: string;
}
