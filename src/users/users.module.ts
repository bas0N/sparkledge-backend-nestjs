import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthenticationService,
  ],
  exports: [JwtModule, PassportModule],
})
export class UsersModule {}
