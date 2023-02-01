export interface IRedisAccount {
  account_id: number;
  updated_at_token: number;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  vendor: string;
  shop_id: number;
  shop_name?: string;
  [key: string]: any;
}

export interface IRedisLimit {
  account_id: number;
  xLimitPerSecond: number;
  xRemainingThisSecond: number;
  xLimitPerDay: number;
  xRemainingToday: number;
}
