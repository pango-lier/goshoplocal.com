import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Receipt } from './entities/receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Receipt])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [TypeOrmModule.forFeature([Listing, Receipt]), ListingsService],
})
export class ListingsModule { }
