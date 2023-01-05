import { CrawlerLinkEnum } from '../enum/crawler-link.enum';

export interface IAaccount {
  id?: number;

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
