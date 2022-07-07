import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Get('email/:token')
  async validateEmailWithToken(@Param('token') token: string) {
    const email = await this.authenticationService.decodeInformationToken(
      token,
    );
    await this.authenticationService.confirmEmail(email);
  }
  @Get('elo')
  async check() {
    return 'esssaa';
  }
}
