import { hookApi } from 'api/hookApi';
import axios from 'axios';

export const deleteCrawlerLink = async (id: number) => {
  return await hookApi('delete', `shops/${id}`, {
    _success: true,
    title: 'Delete Shops',
  });
};
