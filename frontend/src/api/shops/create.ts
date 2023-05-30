import { hookApi } from 'api/hookApi';
import { IAccount, ICreateAccount } from './type/account.interface';

export const createAccount = async (params: ICreateAccount) => {
  return await hookApi('post', `accounts`, {
    params,
    _success: true,
    title: 'Create Shops',
  });
};
