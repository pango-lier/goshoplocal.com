import { hookApi } from 'api/hookApi';
import { IPaginate } from 'api/paginate/interface/paginate.interface';

export const getAccount = async (
  params: IPaginate = { offset: 0, limit: 100 },
) => {
  return await hookApi('get', `accounts`, { params });
};
