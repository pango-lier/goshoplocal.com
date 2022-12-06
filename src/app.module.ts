import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { BullmqModule } from './bullmq/bullmq.module';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('queue'),
      }),
    }),
    BullModule.registerQueue({
      name: 'demo',
      // processors: [join(__dirname, 'queue-bull-mq/demo.processor.js')],
    }),
    EnvModule,
    BullmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
