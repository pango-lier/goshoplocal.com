import { Module } from '@nestjs/common';
import { PaginateService } from './paginate.service';

@Module({
  controllers: [],
  providers: [PaginateService],
})
export class PaginateModule {}
