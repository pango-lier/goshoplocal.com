import axios from 'axios';

export const getConnects = async (
  params: { limit: string; offset: string } = { offset: '0', limit: '100' },
) => {
  const query = new URLSearchParams(params).toString();
  return await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/connects?${query}`,
  );
};
