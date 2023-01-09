import { Module } from '@nestjs/common';
import { EtsyApiService } from './etsy-api.service';
import { EtsyApiController } from './etsy-api.controller';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ListingsModule } from 'src/listings/listings.module';

@Module({
  controllers: [EtsyApiController],
  providers: [EtsyApiService, RefreshTokenService, OauthRedisService],
  imports: [AccountsModule, ListingsModule],
  exports: [AccountsModule, EtsyApiService, OauthRedisService],
})
export class EtsyApiModule {}
