import { Connect } from 'src/connects/entities/connect.entity';
import { User } from 'src/users/entities/user.entity';
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
export class Account {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accessToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scope?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vendor?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  etsy_user_id?: number;

  @Column('varchar', { length: 255, nullable: true })
  primary_email?: string;

  @Column('varchar', { length: 255, nullable: true })
  first_name?: string;

  @Column('varchar', { length: 255, nullable: true })
  last_name?: string;

  @Column('varchar', { length: 2083, nullable: true })
  image_url_75x75?: string;

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

  @ManyToOne(() => User, (u) => u.accounts, { nullable: true })
  user?: User;

  @OneToMany(() => Connect, (u) => u.account, { nullable: true })
  connects?: Connect[];
}
