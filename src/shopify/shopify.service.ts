import { Injectable } from '@nestjs/common';
import { CreateShopifyDto } from './dto/create-shopify.dto';
import { UpdateShopifyDto } from './dto/update-shopify.dto';

@Injectable()
export class ShopifyService {
  create(createShopifyDto: CreateShopifyDto) {
    return 'This action adds a new shopify';
  }

  findAll() {
    return `This action returns all shopify`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopify`;
  }

  update(id: number, updateShopifyDto: UpdateShopifyDto) {
    return `This action updates a #${id} shopify`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopify`;
  }
}
