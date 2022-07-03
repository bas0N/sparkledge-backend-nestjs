import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './document.model';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/users/strategies/access-token.strategy';
import { RefreshTokenStrategy } from 'src/users/strategies/refresh-token.strategy';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    FilesModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class DocumentsModule {}
