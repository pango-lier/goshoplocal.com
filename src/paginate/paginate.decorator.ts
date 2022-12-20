import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPaginate } from './paginate.interface';
import { Request } from 'express';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    let paginate: IPaginate = { offset: undefined, limit: undefined };
    if (request.query.filter && typeof request.query.filter === 'string') {
      const filter = JSON.parse(request.query.filter);

      const pageIndex = parseInt(filter.pageIndex) || undefined;
      const pageSize = parseInt(filter.pageIndex) || undefined;

      const offset = pageIndex * pageSize || undefined;
      const limit = filter.pageSize || undefined;
      const sorted = filter.sorted || undefined;
      const filtered = filter.filtered || undefined;
      paginate = {
        pageIndex,
        pageSize,
        limit,
        offset,
        sorted,
        filtered,
        q: filter.q || undefined,
      };
    }
    return paginate;
  },
);
