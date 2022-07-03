import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

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
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: User) {
    return this.userService.logout(user.email);
  }
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshToken(@GetUser() user: User) {
    return this.userService.refreshToken(user.email, user.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('viewedDocuments')
  async getViewedDocuments(@GetUser() user: User) {
    return this.userService.getViewedDocuments(user);
  }
}
