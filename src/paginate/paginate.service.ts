import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { IPaginate } from './paginate.interface';

@Injectable()
export class PaginateService {
  async queryFilter<T>(
    query: SelectQueryBuilder<T>,
    filter: IPaginate,
    q: Array<string | number> = [],
    options: {
      defaultTable?: string | undefined;
      operator?: string;
      getQuery?: 'getRawMany' | 'getMany';
    } = { getQuery: 'getRawMany', operator: 'like' },
  ) {
    if (filter.sorted) {
      filter.sorted.forEach((sorted) => {
        let sortedId = sorted.id;
        if (
          options.defaultTable !== undefined &&
          !`${sortedId}`.includes('.')
        ) {
          sortedId = `${options.defaultTable}.${sortedId}`;
        }
        query.orderBy(sortedId, sorted.desc === true ? 'DESC' : 'ASC');
      });
    }
    if (filter.filtered && !filter.q) {
      filter.filtered.forEach((filtered) => {
        if (filtered.id === 'q') filter.q = filtered.value;
      });
    }
    if (filter.q && q.length > 0) {
      query.where(`${q[0]} LIKE :q`, {
        q: `%${filter.q}%`,
      });
      for (let index = 1; index < q.length; index++) {
        const element = q[index];
        query.orWhere(`${element} LIKE :q`, {
          q: `%${filter.q}%`,
        });
      }
    } else if (filter.filtered) {
      filter.filtered.forEach((filtered) => {
        let filteredId = filtered.id;
        if (
          options.defaultTable !== undefined &&
          !`${filteredId}`.includes('.')
        ) {
          filteredId = `${options.defaultTable}.${filteredId}`;
        }
        if (options.operator === 'like') {
          query.where(`${filteredId} ${options.operator} :value`, {
            value: `%${filtered.value}%`,
          });
        } else {
          const operator = filtered.operator || '=';
          query.where(`${filteredId} ${operator} :value`, {
            value: filtered.value,
          });
        }
      });
    }
    const total = await query.getCount();
    if (filter.limit) query.limit(filter.limit);
    if (filter.offset) query.offset(filter.offset);
    const result = await query[options.getQuery]();
    return [result, total];
  }
}
