import { PartialType } from '@nestjs/mapped-types';
import { CreateEtsyApiDto } from './create-etsy-api.dto';

export class UpdateEtsyApiDto extends PartialType(CreateEtsyApiDto) {}
