import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {
  BullMQAdapter,
  createBullBoard,
  ExpressAdapter,
} from '@bull-board/express';
import { Queue } from 'bullmq';
import { AccountsModule } from './accounts/accounts.module';
import { ConnectsModule } from './connects/connects.module';
import { PaginateModule } from './paginate/paginate.module';
import { EtsyApiModule } from './etsy-api/etsy-api.module';
import { Oauth2Module } from './oauth2/oauth2.module';
import { ListingsModule } from './listings/listings.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { CurrencyRatesModule } from './currency-rates/currency-rates.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ShopifyModule } from './shopify/shopify.module';
import { ShopsModule } from './shops/shops.module';

@Module({
  imports: [
    DatabaseModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('ioredis'),
      }),
    }),
    EnvModule,
    ScheduleModule.forRoot(),
    BullmqModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    ConnectsModule,
    PaginateModule,
    EtsyApiModule,
    Oauth2Module,
    ListingsModule,
    TaxonomyModule,
    CurrencyRatesModule,
    MailModule,
    ShopifyModule,
    ShopsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
