import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  async addNewUser(@Body() createUserDto: CreateUserDto): Promise<Object> {
    return this.userService.addNewUser(createUserDto);
  }
  @Post('/signin')
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    return this.userService.signInUser(signinUserDto);
  }
}
