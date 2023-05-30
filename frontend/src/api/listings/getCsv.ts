import { hookApi } from 'api/hookApi';

export const getListingCsv = async (id) => {
  return await hookApi('get', `etsy-api/listing/csv/` + id);
};
