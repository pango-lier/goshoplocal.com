import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRatesController } from './currency-rates.controller';
import { CurrencyRatesService } from './currency-rates.service';

describe('CurrencyRatesController', () => {
  let controller: CurrencyRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyRatesController],
      providers: [CurrencyRatesService],
    }).compile();

    controller = module.get<CurrencyRatesController>(CurrencyRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
