import { Module } from '@nestjs/common';
import { EtsyApiService } from './etsy-api.service';
import { EtsyApiController } from './etsy-api.controller';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Oauth2Module } from '../oauth2/oauth2.module';

@Module({
  controllers: [EtsyApiController],
  providers: [EtsyApiService, RefreshTokenService, OauthRedisService],
  imports: [AccountsModule],
  exports: [AccountsModule, EtsyApiService],
})
export class EtsyApiModule {}
