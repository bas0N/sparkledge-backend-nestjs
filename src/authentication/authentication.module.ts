import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from './google.strategy';
import { googleClient } from './googleClient';

@Module({
  imports: [JwtModule.register({}), EmailModule, UsersModule, PrismaModule],
  providers: [
    JwtService,
    AuthenticationService,
    UsersService,
    EmailService,
    PrismaService,
    GoogleStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [JwtModule, UsersModule],
})
export class AuthenticationModule {}
