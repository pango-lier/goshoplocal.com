import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyController } from './shopify.controller';
import { ShopifyService } from './shopify.service';

describe('ShopifyController', () => {
  let controller: ShopifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyController],
      providers: [ShopifyService],
    }).compile();

    controller = module.get<ShopifyController>(ShopifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
