import { Module } from '@nestjs/common';
import { EtsyApiService } from './etsy-api.service';
import { EtsyApiController } from './etsy-api.controller';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ListingsModule } from 'src/listings/listings.module';
import { TaxonomyModule } from 'src/taxonomy/taxonomy.module';
import { FptFileService } from './fpt-file/fpt-file.service';

@Module({
  controllers: [EtsyApiController],
  providers: [
    EtsyApiService,
    RefreshTokenService,
    OauthRedisService,
    FptFileService,
  ],
  imports: [AccountsModule, ListingsModule, TaxonomyModule],
  exports: [AccountsModule, EtsyApiService, OauthRedisService],
})
export class EtsyApiModule {}
