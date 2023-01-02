import { Test, TestingModule } from '@nestjs/testing';
import { EtsyApiController } from './etsy-api.controller';
import { EtsyApiService } from './etsy-api.service';

describe('EtsyApiController', () => {
  let controller: EtsyApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtsyApiController],
      providers: [EtsyApiService],
    }).compile();

    controller = module.get<EtsyApiController>(EtsyApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
