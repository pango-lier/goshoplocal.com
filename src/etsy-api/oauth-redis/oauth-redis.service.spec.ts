import { Test, TestingModule } from '@nestjs/testing';
import { OauthRedisService } from './oauth-redis.service';

describe('OauthRedisService', () => {
  let service: OauthRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthRedisService],
    }).compile();

    service = module.get<OauthRedisService>(OauthRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
