import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import databaseConfig from './database.config';
import ioredis from './ioredis';
import queueConfig from './queue.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: false,
      load: [databaseConfig, authConfig, queueConfig, ioredis],
    }),
  ],
})
export class EnvModule {}
