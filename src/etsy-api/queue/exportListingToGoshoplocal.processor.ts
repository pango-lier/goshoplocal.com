import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('export-listing', {})
export class ExportListingProcessor extends WorkerHost {
  constructor() {
    super();
  }

  @OnWorkerEvent('active')
  OnWorkerEvent(job: Job) {}

  async process(job: Job<any, any, string>, token?: string) {
    switch (job.name) {
      case 'export-listing-to-goshoplocal':
      default:
        break;
    }
  }
}
