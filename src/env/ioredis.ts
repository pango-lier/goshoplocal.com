import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('ioredis', () => ({
  config: {
    url: env.get('REDIS_URL').asString(),
  },
}));
