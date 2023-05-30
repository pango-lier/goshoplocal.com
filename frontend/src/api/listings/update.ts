import { hookApi } from 'api/hookApi';
import { ICreateListing } from './create';

export interface IUpdateListing extends ICreateListing {}

export const updateListing = async (id: number, params: IUpdateListing) => {
  return await hookApi('patch', `listings/${id}`, {
    params,
    _success: true,
    title: 'Create Crawler Link',
  });
};
