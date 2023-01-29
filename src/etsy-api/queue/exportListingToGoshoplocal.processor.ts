import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateListingCsvService } from '../create-listing-csv/create-listing-csv.service';

@Processor('goshoplocal-listing', {
  concurrency: 8,
})
export class ExportListingProcessor extends WorkerHost {
  constructor(private readonly listingCsv: CreateListingCsvService) {
    super();
  }

  @OnWorkerEvent('active')
  OnWorkerEvent(job: Job) {}

  async process(job: Job<any, any, string>, token?: string) {
    switch (job.name) {
      case 'import-csv-listing':
        return await this.listingCsv.createOnceExportCsv(
          job.data.listing,
          job.data.accountEntity,
          job.data.options,
        );
      default:
        break;
    }
  }
}
