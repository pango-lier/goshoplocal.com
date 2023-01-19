import axios from 'axios';

export const shopifyGetUrlRedirectOauth2 = async (
  scope = '',
  vendor = '',
  connectId = null,
) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/shopify/oauth2/url-redirect?scope=${scope}&&vendor=${vendor}&&connectId=${connectId}`,
  );
};
