export interface ICreateAccount {
  message?: string;

  vendor?: string;

  name?: string;

  scope?: string;

  accessToken?: string;

  refreshToken?: string;

  status?: string;

  etsy_user_id?: number;

  primary_email?: string;

  first_name?: string;

  last_name?: string;

  image_url_75x75?: string;

  active?: boolean;

  createdAt?: Date;

  expiredAt?: Date;

  userId?: number;
}
export interface IUpdateAccount extends ICreateAccount {}
export interface IAccount extends IUpdateAccount {
  id: number;
}
