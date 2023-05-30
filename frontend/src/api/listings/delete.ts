import { hookApi } from 'api/hookApi';
import axios from 'axios';

export const deleteListing = async (id: number) => {
  return await hookApi('delete', `listings/${id}`, {
    _success: true,
    title: 'Delete Listing',
  });
};
