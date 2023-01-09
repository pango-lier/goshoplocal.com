import { Module } from '@nestjs/common';
import { DemoProcessor } from './demo.processor';
import { WriteLogProcessor } from './writeLog.processor';
import { OauthRedisService } from 'src/etsy-api/oauth-redis/oauth-redis.service';

@Module({
  providers: [DemoProcessor, WriteLogProcessor, OauthRedisService],
})
export class BullmqModule {}
