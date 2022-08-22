import { IsNotEmpty } from 'class-validator';

export class GoogleAuthenticateDto {
  @IsNotEmpty()
  token: string;
}
