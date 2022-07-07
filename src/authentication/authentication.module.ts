import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [JwtModule.register({}), EmailModule],
  providers: [JwtService, AuthenticationService, EmailService],
  controllers: [AuthenticationController],
  exports: [JwtModule],
})
export class AuthenticationModule {}
