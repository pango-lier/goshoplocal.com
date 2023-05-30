import { hookApi } from 'api/hookApi';
import { IListing } from './type/interface';
export interface ICreateListing extends IListing {}

export const createCrawlerLink = async (params: ICreateListing) => {
  return await hookApi('post', `accounts`, {
    params,
    _success: true,
    title: 'Create Shops',
  });
};
