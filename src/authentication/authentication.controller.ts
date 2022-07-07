import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post()
  async validateEmail(@Query() token: string) {
    return this.authenticationService.validateEmail(token);
  }
}
