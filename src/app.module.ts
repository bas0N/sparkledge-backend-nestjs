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

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    DocumentsModule,
    PrismaModule,
    InfrastructureModule,
    FilesModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [PassportModule, AppService],
})
export class AppModule {}
