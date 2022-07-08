import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
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
}
