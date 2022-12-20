import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { IPaginate } from './paginate.interface';

@Injectable()
export class PaginateService {
  async queryFilter<T>(query: SelectQueryBuilder<T>, filter: IPaginate) {
    if (filter.q) {
      query.where('users.name LIKE :s OR users.id = :q', {
        s: `%${filter.q}%`,
        q: filter.q,
      });
    }
    if (filter.limit) query.limit(filter.limit);
    if (filter.offset) query.offset(filter.offset);

    if (filter.sorted) {
      filter.sorted.forEach((sorted) => {
        query.orderBy(sorted.id, sorted.desc === true ? 'DESC' : 'ASC');
      });
    }

    return await query.getManyAndCount();
  }
}
