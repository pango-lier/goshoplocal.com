import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OauthRedisService } from 'src/etsy-api/oauth-redis/oauth-redis.service';

@Processor('demo', {})
export class DemoProcessor extends WorkerHost {
  private readonly logger = new Logger(DemoProcessor.name);
  constructor(
    @InjectRedis() private redis: Redis,
    private readonly redisService: OauthRedisService,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  async OnWorkerEvent(job: Job) {
    this.logger.debug('debug');

    console.log(
      `OnWorkerEvent  ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  async process(job: Job<any, any, string>, token?: string) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}... ${token}`,
    );
  }
}
