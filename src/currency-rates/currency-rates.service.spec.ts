import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRatesService } from './currency-rates.service';

describe('CurrencyRatesService', () => {
  let service: CurrencyRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyRatesService],
    }).compile();

    service = module.get<CurrencyRatesService>(CurrencyRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
