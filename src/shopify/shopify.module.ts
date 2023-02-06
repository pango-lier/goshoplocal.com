import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { Oauth2Module } from './oauth2/oauth2.module';

@Module({
  controllers: [ShopifyController],
  providers: [ShopifyService],
  imports: [Oauth2Module],
})
export class ShopifyModule {}
