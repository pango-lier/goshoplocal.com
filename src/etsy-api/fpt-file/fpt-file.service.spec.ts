import { Test, TestingModule } from '@nestjs/testing';
import { FptFileService } from './fpt-file.service';

describe('FptFileService', () => {
  let service: FptFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FptFileService],
    }).compile();

    service = module.get<FptFileService>(FptFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
