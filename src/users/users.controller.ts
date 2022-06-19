import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  async addNewUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.addNewUser(createUserDto);
  }
}
