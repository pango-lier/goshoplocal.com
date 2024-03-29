import { IsBoolean, isBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;

  @IsString()
  vendor?: string;

  @IsString()
  role?: string;

  @IsString()
  username?: string;

  @IsString()
  email?: string;

  @IsString()
  password: string;

  @IsBoolean()
  active?: boolean;
}
