import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InfrastructureController } from './infrastructure.controller';

@Module({
  imports: [PrismaModule],
  controllers: [InfrastructureController],
})
export class InfrastructureModule {}
