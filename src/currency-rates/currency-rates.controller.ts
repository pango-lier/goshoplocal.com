import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrencyRatesService } from './currency-rates.service';
import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';

@Controller('currency-rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @Post()
  create(@Body() createCurrencyRateDto: CreateCurrencyRateDto) {
    return this.currencyRatesService.create(createCurrencyRateDto);
  }

  @Get()
  findAll() {
    return this.currencyRatesService.sync();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyRatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrencyRateDto: UpdateCurrencyRateDto,
  ) {
    return this.currencyRatesService.update(+id, updateCurrencyRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyRatesService.remove(+id);
  }
}
