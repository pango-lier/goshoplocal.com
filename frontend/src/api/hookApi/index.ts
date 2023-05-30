import { notifyError, notifySuccess } from 'utility/notify';
import axios from 'axios';

export interface IOptionsHookApi {
  _error?: boolean;
  _success?: boolean;
  title?: string;
  params?: any;
}

export const hookApi = async (
  method: 'get' | 'post' | 'delete' | 'put' | 'patch',
  uri,
  { _error, _success, title, params }: IOptionsHookApi = {
    _error: true,
    _success: false,
  },
) => {
  try {
    if (method === 'get' && params) {
      if (params?.sorted) {
        params.sorted = JSON.stringify(params.sorted);
      }
      if (params?.filtered) {
        params.filtered = JSON.stringify(params.filtered);
      }

      const query = new URLSearchParams(params).toString();
      uri = `${uri}?${query}`;
    }
    const data = await axios[method](
      `${process.env.REACT_APP_SERVER_URL}/${uri}`,
      params,
    );
    if (_success)
      await notifySuccess(
        `${title ? title : method.toUpperCase} is successful .`,
      );
    return data;
  } catch (error) {
    if (_error) await notifyError(error);
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    else message = String(error);
    throw new Error(message);
  }
};
