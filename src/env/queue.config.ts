import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('queue', () => ({
  connection: {
    host: env.get('REDIS_HOST').asString(),
    port: env.get('REDIS_PORT').asIntPositive(),
  },
  limiter: {
    max: env.get('QUEUE_LIMITER_MAX').asIntPositive(),
    duration: env.get('QUEUE_LIMITER_DURATION').asIntPositive(),
  },
  settings: {
    maxStalledCount: env.get('QUEUE_MAX_STALLED_COUNT').asIntPositive(),
    retryProcessDelay: env.get('QUEUE_RETRY_PROCESS_DELAY').asIntPositive(),
  },
}));
