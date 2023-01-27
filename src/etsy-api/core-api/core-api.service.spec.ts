import { Test, TestingModule } from '@nestjs/testing';
import { CoreApiService } from './core-api.service';

describe('CoreApiService', () => {
  let service: CoreApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreApiService],
    }).compile();

    service = module.get<CoreApiService>(CoreApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
