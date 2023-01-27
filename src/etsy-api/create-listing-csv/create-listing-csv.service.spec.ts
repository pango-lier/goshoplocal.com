import { Test, TestingModule } from '@nestjs/testing';
import { CreateListingCsvService } from './create-listing-csv.service';

describe('CreateListingCsvService', () => {
  let service: CreateListingCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateListingCsvService],
    }).compile();

    service = module.get<CreateListingCsvService>(CreateListingCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
