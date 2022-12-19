import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPaginate } from './paginate.interface';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const paginate: IPaginate = {};
    if (req.query?.limit && typeof req.query.limit === 'string') {
      paginate.limit = parseInt(req.query.limit);
    }
    if (req.query?.limit && typeof req.query.limit === 'string') {
      paginate.limit = parseInt(req.query.limit);
    }
    if (req.query?.q && typeof req.query.q === 'string') {
      paginate.q = req.query?.q;
    }
    if (req.query?.sort && typeof req.query.sort === 'object') {
      paginate.sort = req.query?.sort;
    }
    if (req.query?.filter && typeof req.query.filter === 'object') {
      paginate.filter = req.query?.filter;
    }
    return paginate;
  },
);
