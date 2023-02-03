import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  InjectQueue,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { CreateListingCsvService } from '../create-listing-csv/create-listing-csv.service';

@Processor('goshoplocal-listing-csv', {
  concurrency: 8,
})
export class ExportListingProcessor extends WorkerHost {
  constructor(
    private readonly listingCsv: CreateListingCsvService,
    @InjectQueue('write-log') private readonly log: Queue,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  OnWorkerEvent(job: Job) {}

  @OnWorkerEvent('failed')
  failed(job: Job, err) {
    this.log.add(job.name, { meesage: err?.message || '' });
  }

  async process(job: Job<any, any, string>, token?: string) {
    switch (job.name) {
      case 'import-csv-listing-vendor':
        return await this.listingCsv.createListingVendorCsv(
          job.data.accountId,
          job.data.options,
        );
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
