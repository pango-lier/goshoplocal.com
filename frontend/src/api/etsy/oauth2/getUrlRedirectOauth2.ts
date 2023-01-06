import axios from 'axios';

export const getUrlRedirectOauth2 = async (
  scope = '',
  vendor = '',
  connectId = null,
) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/oauth/url-redirect?scope=${scope}&&vendor=${vendor}&&connectId=${connectId}`,
  );
};
