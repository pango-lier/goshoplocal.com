import axios from 'axios';

export const createConnect = async (params: { name?: string }) => {
  return await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/connects`,
    params,
  );
};
