import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { FilesModule } from './files/files.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from './email/email.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DocumentsModule,
    PrismaModule,
    InfrastructureModule,
    FilesModule,
    PassportModule,
    EmailModule,
    AuthenticationModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [PassportModule, AppService],
})
export class AppModule {}
