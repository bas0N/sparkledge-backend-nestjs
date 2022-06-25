import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async addNewUser(@Body() user: User): Promise<User> {
    return this.userService.addNewUser(user);
  }

  @Post('/signin')
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    return this.userService.signInUser(signinUserDto);
  }
}
