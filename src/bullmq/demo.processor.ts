import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('demo', {})
export class DemoProcessor extends WorkerHost {
  private readonly logger = new Logger(DemoProcessor.name);
  constructor(@InjectRedis() private redis: Redis) {
    super();
  }

  @OnWorkerEvent('active')
  async OnWorkerEvent(job: Job) {
    this.logger.debug('debug');
    try {
      await this.redis.hmset('token_oauth2_account', {
        account_id: 'bb',
        updated_at_token: 'scc',
      });
      const user = await this.redis.hmget(
        'token_oauth2_385439114',
        'account_id',
        'updated_at_token',
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
    console.log({ a: 12, b: 12 });

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
