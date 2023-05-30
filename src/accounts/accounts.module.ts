import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { OauthRedisService } from 'src/etsy-api/oauth-redis/oauth-redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [AccountsService, OauthRedisService],
  exports: [
    TypeOrmModule.forFeature([Account]),
    AccountsModule,
    AccountsService,
  ],
})
export class AccountsModule {}
