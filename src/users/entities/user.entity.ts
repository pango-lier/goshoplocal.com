import { Account } from 'src/accounts/entities/account.entity';
import { Connect } from 'src/connects/entities/connect.entity';
import { Listing } from 'src/listings/entities/listing.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 191, nullable: true })
  name?: string;

  @Column('varchar', { length: 191, unique: true, nullable: true })
  username?: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Column({ length: 128, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rememberToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string;

  @Column('boolean', { default: true })
  active?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'guest' })
  role?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;

  @OneToMany(() => Account, (u) => u.user, { nullable: true })
  accounts?: Account[];

  @OneToMany(() => Connect, (u) => u.user, { nullable: true })
  connects?: Connect[];

  @OneToMany(() => Listing, (u) => u.userb, { nullable: true })
  listings?: Listing[];

  @OneToMany(() => Shop, (u) => u.user, { nullable: true })
  shopIds?: Shop[];
}
