export interface IListing {
  id?: number;

  accountId?: number;

  userId?: number;

  status?: string;

  message?: string;

  createdAt?: Date;

  etsy_listing_id?: number;

  etsy_user_id?: number;

  shop_id?: number;

  title?: string;

  description?: string;

  state?: string;

  creation_timestamp?: number;

  created_timestamp?: number;

  ending_timestamp?: number;

  original_creation_timestamp?: number;

  last_modified_timestamp?: number;

  updated_timestamp?: number;

  state_timestamp?: number;

  quantity?: number;

  shop_section_id?: number;

  featured_rank?: number;

  url?: string;

  num_favorers?: number;

  non_taxable?: boolean;

  is_taxable?: boolean;

  is_customizable?: boolean;

  is_personalizable?: boolean;

  personalization_is_required?: boolean;

  personalization_char_count_max?: number;

  personalization_instructions?: string;

  listing_type?: 'physical' | 'download' | 'both';

  tags?: string; //[]

  materials?: string; //[]

  shipping_profile_id?: number;

  return_policy_id?: number;

  processing_min?: number;

  processing_max?: number;

  who_made?: 'i_did' | 'someone_else' | 'collective';

  when_made?:
    | 'made_to_order'
    | '2020_2023'
    | '2010_2019'
    | '2004_2009'
    | 'before_2004'
    | '2000_2003'
    | '1990s'
    | '1980s'
    | '1970s'
    | '1960s'
    | '1950s'
    | '1940s'
    | '1930s'
    | '1920s'
    | '1910s'
    | '1900s'
    | '1800s'
    | '1700s'
    | 'before_1700';

  is_supply?: boolean;

  item_weight?: number;
  item_weight_unit: 'oz' | 'lb' | 'g' | 'kg';

  item_length?: number;

  item_width?: number;

  item_height?: number;

  item_dimensions_unit: 'in' | 'ft' | 'mm' | 'cm' | 'm' | 'yd' | 'inches';

  is_private?: boolean;

  style?: string; //[];

  file_data?: string;

  has_variations?: boolean;

  should_auto_renew?: boolean;

  language?: string;

  price?: string; //{};

  taxonomy_id?: number;

  taxonomy?: string; //{}

  shipping_profile?: string; //{}

  user?: string; //{}

  shop?: string; //{}

  images?: string; //{}

  inventory?: string; //{}

  production_partners?: string; //[]

  translations?: string; //[]

  skus?: string; //[]

  views?: number;
}
