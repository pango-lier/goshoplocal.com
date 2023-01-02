import { Test, TestingModule } from '@nestjs/testing';
import { EtsyApiService } from './etsy-api.service';

describe('EtsyApiService', () => {
  let service: EtsyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtsyApiService],
    }).compile();

    service = module.get<EtsyApiService>(EtsyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
