import { hookApi } from 'api/hookApi';

export const deleteAccount= async (id: number) => {
  return await hookApi('delete', `accounts/${id}`, {
    _success: true,
    title: 'Delete Shops',
  });
};
