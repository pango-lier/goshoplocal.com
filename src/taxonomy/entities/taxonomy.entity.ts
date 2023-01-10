import { Listing } from 'src/listings/entities/listing.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Taxonomy {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 191, nullable: true })
  name?: string;

  @Column('bigint', { nullable: true })
  parent_id: number;

  @Column('int', { nullable: true })
  level: number;

  @Column('simple-array', { nullable: true })
  full_path_taxonomy_ids?: number[];

  @Column('boolean', { default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Listing, (u) => u.taxonomyb, { nullable: true })
  listings?: Listing[];
}
