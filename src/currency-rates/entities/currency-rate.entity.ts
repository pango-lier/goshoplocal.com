import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 3, unique: true })
  currencyCode: string;

  @Column({ type: 'decimal', precision: 16, scale: 4 })
  rate: number;
}
