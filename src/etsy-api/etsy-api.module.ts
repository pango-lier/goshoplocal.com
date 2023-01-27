import { Module } from '@nestjs/common';
import { EtsyApiService } from './etsy-api.service';
import { EtsyApiController } from './etsy-api.controller';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ListingsModule } from 'src/listings/listings.module';
import { TaxonomyModule } from 'src/taxonomy/taxonomy.module';
import { FptFileService } from './fpt-file/fpt-file.service';
import { CurrencyRatesModule } from 'src/currency-rates/currency-rates.module';
import { CreateListingCsvService } from './create-listing-csv/create-listing-csv.service';
import { ExportListingProcessor } from './queue/exportListingToGoshoplocal.processor';
import { CoreApiService } from './core-api/core-api.service';

@Module({
  controllers: [EtsyApiController],
  providers: [
    EtsyApiService,
    RefreshTokenService,
    OauthRedisService,
    FptFileService,
    CreateListingCsvService,
    ExportListingProcessor,
    CoreApiService,
  ],
  imports: [
    AccountsModule,
    ListingsModule,
    TaxonomyModule,
    CurrencyRatesModule,
  ],
  exports: [AccountsModule, EtsyApiService, OauthRedisService],
})
export class EtsyApiModule {}
