import axios from 'axios';

export const getUrlRedirectOauth2 = async (
  scope = '',
  connectId = null,
) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/oauth2/url-redirect?scope=${scope}&&connectId=${connectId}`,
  );
};
