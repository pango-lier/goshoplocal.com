import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { IFiltered, IPaginate } from './paginate.interface';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const paginate: IPaginate = { offset: undefined, limit: undefined };

    if (request.query.offset) {
      const filter = request.query;

      paginate.pageIndex = +filter?.pageIndex;
      paginate.pageSize = +filter?.pageSize;

      paginate.offset = +filter.offset;
      paginate.limit = +filter.limit || undefined;
      if (filter?.sorted) {
        paginate.sorted = JSON.parse(filter.sorted as string);
      }
      if (filter?.filtered) {
        paginate.filtered = JSON.parse(filter.filtered as string);
      }
      if (filter?.filtered) {
        paginate.q = filter.q as any;
      }
    }
    return paginate;
  },
);
