import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from './infrastructure.controller';

describe('InfrastructureController', () => {
  let controller: InfrastructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
    }).compile();

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
