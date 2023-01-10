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
    BullModule.registerQueue({
      name: 'write-log',
      // processors: [join(__dirname, 'queue-bull-mq/demo.processor.js')],
    }),
    EnvModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  serverAdapter = new ExpressAdapter();
  constructor(
    @InjectQueue('demo') private demoQueue: Queue,
    @InjectQueue('write-log') private writeLogQueue: Queue,
  ) {
    this.serverAdapter.setBasePath('/api/admin/queues');
    createBullBoard({
      queues: [new BullMQAdapter(demoQueue), new BullMQAdapter(writeLogQueue)],
      serverAdapter: this.serverAdapter,
    });
    for (let index = 0; index < 1; index++) {
      this.demoQueue.add('Start', { ok: index + 'Test queue' });
      this.writeLogQueue.add('Start', { ok: index + 'Test queue' });
    }
  }

  configure(consumer: MiddlewareConsumer) {
    const bullBoardRouter = this.serverAdapter.getRouter();
    consumer.apply(bullBoardRouter).forRoutes('/admin/queues');
  }
}
