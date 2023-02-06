import { PartialType } from '@nestjs/mapped-types';
import { CreateShopifyDto } from './create-shopify.dto';

export class UpdateShopifyDto extends PartialType(CreateShopifyDto) {}
