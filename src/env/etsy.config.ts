import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('etsy', () => ({
  clientId: '',
  scope:
    'address_r address_w billing_r cart_r cart_w email_r favorites_r favorites_w feedback_r listings_d listings_r listings_w profile_r profile_w recommend_r recommend_w shops_r shops_w transactions_r transactions_w',
  redirectUri: 'http://localhost:4000/oauth/verifier',
}));
