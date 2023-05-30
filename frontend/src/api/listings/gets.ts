import { hookApi } from 'api/hookApi';
import { IPaginate } from 'api/paginate/interface/paginate.interface';

export const getListings = async (
  params: IPaginate = {
    offset: 0,
    limit: 100,
  },
) => {
  const a: any = { ...params };

  return await hookApi('get', `listings`, { params });
};
