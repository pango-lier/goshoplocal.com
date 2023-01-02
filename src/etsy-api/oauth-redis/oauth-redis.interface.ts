export interface IRedisAccount {
  account_id: number | string;
  updated_at_token: number | string;
  access_token: string;
  token_type: string;
  expires_in: number | string;
  refresh_token: string;
}
