import { Injectable } from '@nestjs/common';
import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CurrencyRatesService {
  constructor(
    @InjectRepository(CurrencyRate)
    private readonly currencyRate: Repository<CurrencyRate>,
  ) {}

  create(createCurrencyRateDto: CreateCurrencyRateDto) {
    return 'This action adds a new currencyRate';
  }

  async findAll() {
    return await this.currencyRate.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} currencyRate`;
  }

  update(id: number, updateCurrencyRateDto: UpdateCurrencyRateDto) {
    return `This action updates a #${id} currencyRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} currencyRate`;
  }

  async convertCurrentDefault(price: number, currencyCode) {
    const current = await this.currencyRate.findOneBy({ currencyCode });
    return price / current.rate;
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: 'get-currentcy',
    timeZone: 'America/New_York',
  })
  async sync() {
    const currency = await axios.get(process.env.CURRENCY_RATE_URL, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        apikey: process.env.CURRENCY_RATE_API_KEY,
      },
    });
    for (const [currencyCode, rate] of Object.entries(
      currency.data.rates,
    ) as any) {
      const currentRate: CreateCurrencyRateDto = {
        currencyCode,
        rate,
      };
      await this.currencyRate.upsert(currentRate, ['currencyCode']);
    }

    return currency.data;
  }
}
