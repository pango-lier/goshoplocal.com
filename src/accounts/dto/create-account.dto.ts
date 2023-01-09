export class CreateAccountDto {
  name?: string;

  message?: string;

  scope?: string;

  accessToken?: string;

  refreshToken?: string;

  shop_id?: number;

  shop_name?: string;

  vendor?: string;

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
