import { Test, TestingModule } from '@nestjs/testing';
import { ConnectsController } from './connects.controller';
import { ConnectsService } from './connects.service';

describe('ConnectsController', () => {
  let controller: ConnectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectsController],
      providers: [ConnectsService],
    }).compile();

    controller = module.get<ConnectsController>(ConnectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
