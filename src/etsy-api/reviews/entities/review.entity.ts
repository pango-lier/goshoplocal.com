import { Listing } from 'src/listings/entities/listing.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  listingId: number;

  @Column({ type: 'bigint' })
  shop_id: number;

  @Column({ type: 'bigint' })
  listing_id: number;

  @Column({ type: 'bigint' })
  rating: number;

  @Column({ type: 'varchar', nullable: true })
  review: string;

  @Column({ type: 'varchar', nullable: true })
  language: string;

  @Column({ type: 'varchar', nullable: true })
  image_url_fullxfull: string;

  @Column({ type: 'bigint', nullable: true })
  create_timestamp?: number;

  @Column({ type: 'bigint', nullable: true })
  created_timestamp?: number;

  @Column({ type: 'bigint', nullable: true })
  update_timestamp: number;

  @Column({ type: 'bigint', nullable: true })
  updated_timestamp?: number;

  @ManyToOne(() => Listing, (u) => u.reviews, { nullable: true })
  listing?: Listing;
}
