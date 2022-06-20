import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InfrastructureController } from './infrastructure.controller';
import { InfrastructureService } from './infrastructure.service';

@Module({
  imports: [PrismaModule],
  controllers: [InfrastructureController],
  providers: [InfrastructureService],
})
export class InfrastructureModule {}
