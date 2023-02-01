import { Account } from 'src/accounts/entities/account.entity';
import { Taxonomy } from 'src/taxonomy/entities/taxonomy.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  csvFile?: string;

  @Column({ type: 'json', nullable: true })
  variationImages?: string;

  @Column({ type: 'bigint', nullable: true })
  accountId?: number;

  @ManyToOne(() => Account, (a) => a.listings)
  account: Account;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'varchar', nullable: true })
  'status'?: string;

  @Column({ type: 'varchar', nullable: true })
  vendor?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  'message'?: string;

  @Column('boolean', { default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (u) => u.listings, { nullable: true })
  userb?: User;

  @ManyToOne(() => Taxonomy, (u) => u.listings, { nullable: true })
  @JoinColumn({ name: 'taxonomy_id' })
  taxonomyb?: Taxonomy;

  @Column({ type: 'bigint', nullable: true })
  'etsy_listing_id'?: number;

  @Column({ type: 'bigint', nullable: true })
  'etsy_user_id'?: number;

  @Column({ type: 'bigint', nullable: true })
  'shop_id'?: number;

  @Column({ type: 'varchar', nullable: true })
  'title': string;

  @Column({ type: 'text', nullable: true })
  'description': string;

  @Column({ type: 'varchar', nullable: true })
  'state': string;

  @Column({ type: 'bigint', nullable: true })
  'creation_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'created_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'ending_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'original_creation_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'last_modified_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'updated_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'state_timestamp': number;

  @Column({ type: 'bigint', nullable: true })
  'quantity': number;

  @Column({ type: 'bigint', nullable: true })
  'shop_section_id': number;

  @Column({ type: 'bigint', nullable: true })
  'featured_rank': number;

  @Column({ type: 'varchar', nullable: true })
  'url': string;

  @Column({ type: 'bigint', nullable: true })
  'num_favorers': number;

  @Column({ type: 'boolean', nullable: true })
  'non_taxable': boolean;

  @Column({ type: 'boolean', nullable: true })
  'is_taxable': boolean;

  @Column({ type: 'boolean', nullable: true })
  'is_customizable': boolean;

  @Column({ type: 'boolean', nullable: true })
  'is_personalizable': boolean;

  @Column({ type: 'boolean', nullable: true })
  'personalization_is_required': boolean;

  @Column({ type: 'bigint', nullable: true })
  'personalization_char_count_max': number;

  @Column({ type: 'text', nullable: true })
  'personalization_instructions': string;

  @Column({ type: 'varchar', nullable: true })
  'listing_type': 'physical' | 'download' | 'both';

  @Column({ type: 'json', nullable: true })
  'tags': string; //[]

  @Column({ type: 'json', nullable: true })
  'materials': string; //[]

  @Column({ type: 'bigint', nullable: true })
  'shipping_profile_id': number;

  @Column({ type: 'bigint', nullable: true })
  'return_policy_id': number;

  @Column({ type: 'bigint', nullable: true })
  'processing_min': number;

  @Column({ type: 'bigint', nullable: true })
  'processing_max': number;

  @Column({ type: 'varchar', nullable: true })
  'who_made': 'i_did' | 'someone_else' | 'collective';

  @Column({ type: 'varchar', nullable: true })
  'when_made':
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

  @Column({ type: 'boolean', nullable: true })
  'is_supply': boolean;

  @Column({ type: 'bigint', nullable: true })
  'item_weight': number;
  @Column({ type: 'varchar', nullable: true })
  'item_weight_unit': 'oz' | 'lb' | 'g' | 'kg';

  @Column({ type: 'bigint', nullable: true })
  'item_length': number;

  @Column({ type: 'bigint', nullable: true })
  'item_width': number;

  @Column({ type: 'bigint', nullable: true })
  'item_height': number;

  @Column({ type: 'varchar', nullable: true })
  'item_dimensions_unit': 'in' | 'ft' | 'mm' | 'cm' | 'm' | 'yd' | 'inches';

  @Column({ type: 'boolean', nullable: true })
  'is_private': boolean;

  @Column({ type: 'varchar', nullable: true })
  'style': string; //[];

  @Column({ type: 'text', nullable: true })
  'file_data': string;

  @Column({ type: 'boolean', nullable: true })
  'has_variations': boolean;

  @Column({ type: 'boolean', nullable: true })
  'should_auto_renew': boolean;

  @Column({ type: 'varchar', nullable: true })
  'language': string;

  @Column({ type: 'json', nullable: true })
  'price': string; //{};

  @Column({ type: 'bigint', nullable: true })
  taxonomy_id: number;

  @Column({ type: 'json', nullable: true })
  'taxonomy'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'shipping_profile'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'user'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'shop'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'images'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'inventory'?: string; //{}

  @Column({ type: 'json', nullable: true })
  'production_partners'?: string; //[]

  @Column({ type: 'json', nullable: true })
  'translations'?: string; //[]

  @Column({ type: 'json', nullable: true })
  'skus'?: string; //[]

  @Column({ type: 'bigint', nullable: true })
  'views'?: number;
}
