import { Test, TestingModule } from '@nestjs/testing';
import { PaginateService } from './paginate.service';

describe('PaginateService', () => {
  let service: PaginateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginateService],
    }).compile();

    service = module.get<PaginateService>(PaginateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
