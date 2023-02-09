import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: 0 })
  shop_id?: number;

  @Column('varchar', { length: 255, nullable: true })
  shop_name?: string;

  @Column('varchar', { length: 2083, nullable: true })
  url?: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  num_favorers?: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  review_count?: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  review_average?: number;

  @Column('boolean', { default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt?: Date;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'json', nullable: true })
  shop?: string; //{}

  @ManyToOne(() => User, (u) => u.shops, { nullable: true })
  user?: User;
}
