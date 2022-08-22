import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';
import { AuthenticationService } from './authentication.service';
import { GoogleAuthenticateDto } from './dto/GoogleAuthenticate.dto';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('google')
  async googleAuthenticate(@Body() googleAuthDto: GoogleAuthenticateDto) {
    return await this.authenticationService.googleAuthenticate(googleAuthDto);
  }
  @Get('/:token')
  async validateEmailWithToken(@Param('token') token: string) {
    const email = await this.authenticationService.decodeInformationToken(
      token,
    );
    await this.authenticationService.confirmEmail(email);
  }
  @Post('resend-verification-link')
  @UseGuards(AuthGuard('jwt'))
  async resendVerificationLink(@GetUser() user: User) {
    return await this.authenticationService.resendVerificationLink(user.email);
  }
  // @Get('google/auth')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleRedirect(@Req() req) {
  //   return await this.authenticationService.googleRedirect(req);
  // }
}
