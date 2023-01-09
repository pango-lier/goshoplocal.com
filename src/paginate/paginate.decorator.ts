import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { IPaginate } from './paginate.interface';

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
