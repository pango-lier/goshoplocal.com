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
import { EnumConnectStatus } from '../enum/connect.enum';
import { Account } from 'src/accounts/entities/account.entity';

@Entity()
export class Connect {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accessToken?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip?: boolean;

  @Column({
    type: 'enum',
    enum: EnumConnectStatus,
    default: EnumConnectStatus.None,
  })
  status?: EnumConnectStatus;

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

  @ManyToOne(() => User, (u) => u.connects)
  user?: User;

  @ManyToOne(() => Account, (u) => u.connects, { nullable: true })
  account?: Account;
}
