import { hookApi } from 'api/hookApi';

export const syncAccount = async (id: number) => {
  return await hookApi('post', `etsy-api/sync`, {
    params: { id },
    _success: true,
    title: 'Sync Account form Etsy',
  });
};
