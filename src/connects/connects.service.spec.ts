import { Test, TestingModule } from '@nestjs/testing';
import { ConnectsService } from './connects.service';

describe('ConnectsService', () => {
  let service: ConnectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectsService],
    }).compile();

    service = module.get<ConnectsService>(ConnectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
