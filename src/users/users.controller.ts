import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async addNewUser(@Body() user: User): Promise<User> {
    return this.userService.addNewUser(user);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    return this.userService.signInUser(signinUserDto);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async logout(@Body() email: string) {
    return this.userService.logout(email);
  }
}
