export class CreateShopDto {
  shop_id?: number;
  shop_name?: string;
  url?: string;
  num_favorers?: number;
  review_count?: number;
  review_average?: number;
  expiredAt?: Date;
  userId?: number;
  shop?: string; //{}
}
