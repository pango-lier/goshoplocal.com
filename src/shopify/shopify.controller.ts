import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { CreateShopifyDto } from './dto/create-shopify.dto';
import { UpdateShopifyDto } from './dto/update-shopify.dto';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Post()
  create(@Body() createShopifyDto: CreateShopifyDto) {
    return this.shopifyService.create(createShopifyDto);
  }

  @Get()
  findAll() {
    return this.shopifyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopifyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopifyDto: UpdateShopifyDto) {
    return this.shopifyService.update(+id, updateShopifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopifyService.remove(+id);
  }
}
