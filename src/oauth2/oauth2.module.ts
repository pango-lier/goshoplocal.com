import { Module } from '@nestjs/common';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { EtsyApiModule } from '../etsy-api/etsy-api.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
  imports: [EtsyApiModule, AccountsModule],
})
export class Oauth2Module {}
