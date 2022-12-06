import { registerAs } from '@nestjs/config';
import * as env from 'env-var';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default registerAs(
  'database',
  () =>
    <MysqlConnectionOptions>{
      type: 'mysql',
      extra: {
        charset: 'utf8mb4',
      },
      host: env.get('DB_HOST').asString(),
      port: env.get('DB_PORT').asIntPositive(),
      username: env.get('DB_USERNAME').asString(),
      password: env.get('DB_PASSWORD').asString(),
      database: env.get('DB_DATABASE').asString(),
      synchronize: env.get('DB_SYNCHRONIZE').asBool(),
      // migrationsRun: !env.get('DB_SYNCHRONIZE').asBool(),
      logging: env.get('DB_LOGGING').asBool(),
      // cache: {
      //   type: 'ioredis',
      //   alwaysEnabled: env.get('DB_CACHE_DURATION').asIntPositive() > 0,
      //   duration: env.get('DB_CACHE_DURATION').asIntPositive(),
      //   options: {
      //     host: env.get('REDIS_HOST').asString(),
      //     port: env.get('REDIS_PORT').asIntPositive(),
      //   },
      // },
      entities: ['dist/**/*.entity{.js,.ts}'],
      subscribers: ['dist/**/*.subscriber{.js,.ts}'],
      migrations: ['dist/database/migrations/*{.js,.ts}'],
      autoLoadEntities: true,
      keepConnectionAlive: true,
    },
);
