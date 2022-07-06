import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  @ApiBody({ type: [CreateUserDto] })
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiConflictResponse({ description: 'Email provided already exists.' })
  @HttpCode(HttpStatus.CREATED)
  async addNewUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.addNewUser(createUserDto);
  }

  @Post('/signin')
  @ApiBody({ type: [SigninUserDto] })
  @ApiOkResponse({ description: 'User logged in.' })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
  })
  @HttpCode(HttpStatus.OK)
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    return this.userService.signInUser(signinUserDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: User) {
    return this.userService.logout(user.email);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Access and refresh tokens renewed' })
  async refreshToken(@GetUser() user: User) {
    return this.userService.refreshToken(user.email, user.refreshToken);
  }
  @Get('viewedDocuments')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getViewedDocuments(@GetUser() user: User) {
    return this.userService.getViewedDocuments(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: 'User retrieved succesfully.' })
  @ApiParam({
    name: 'userId',
    description: 'Id of the user that is to be retrieved.',
  })
  @Get('/:userId')
  async getUserById(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getUserById(userId);
  }
}
