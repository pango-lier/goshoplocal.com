import { hookApi } from 'api/hookApi';

export const syncListing = async (id: number) => {
  return await hookApi('post', `etsy-api/sync/listing`, {
    params: { id },
    _success: true,
    _error: true,
    title: 'Sync Listing form Etsy',
  });
};
