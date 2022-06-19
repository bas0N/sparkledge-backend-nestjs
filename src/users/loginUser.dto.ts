import { IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
