import { Global, Module } from '@nestjs/common';
import { PaginateService } from './paginate.service';

@Global()
@Module({
  providers: [PaginateService],
  exports: [PaginateService],
})
export class PaginateModule {}
