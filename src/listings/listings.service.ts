import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { IPaginate } from 'src/paginate/paginate.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Repository } from 'typeorm';
import { PaginateService } from 'src/paginate/paginate.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listing: Repository<Listing>,
    private readonly paginateService: PaginateService,
  ) {}
  create(createListingDto: CreateListingDto) {
    return 'This action adds a new listing';
  }

  findAll(paginate: IPaginate) {
    const query = this.listing.createQueryBuilder('listing');
    query.select('listing.*');
    query.leftJoinAndSelect('listing.userb', 'userb');
    query.leftJoinAndSelect('listing.account', 'account');
    return this.paginateService.queryFilter(query, paginate, [
      'listing.title',
      'listing.etsy_user_id',
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} listing`;
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
