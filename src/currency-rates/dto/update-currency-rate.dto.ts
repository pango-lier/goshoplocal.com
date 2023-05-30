import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyRateDto } from './create-currency-rate.dto';

export class UpdateCurrencyRateDto extends PartialType(CreateCurrencyRateDto) {}
