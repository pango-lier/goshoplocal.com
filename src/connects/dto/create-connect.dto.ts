import { IsString } from 'class-validator';
import { EnumConnectStatus } from '../enum/connect.enum';

export class CreateConnectDto {
  @IsString()
  name?: string;

  @IsString()
  accessToken?: string;

  @IsString()
  ip?: boolean;

  status?: EnumConnectStatus;

  active?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  expiredAt?: Date;

  user_id?: number;

  account_id?: number;
}
