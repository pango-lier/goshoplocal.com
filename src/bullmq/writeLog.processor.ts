import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('write-log', {})
export class WriteLogProcessor extends WorkerHost {
  constructor() {
    super();
  }

  @OnWorkerEvent('active')
  OnWorkerEvent(job: Job) {}

  async process(job: Job<any, any, string>, token?: string) {}
}
