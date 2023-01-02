import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { IRedisAccount } from './oauth-redis.interface';

@Injectable()
export class OauthRedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getAccountTokens(accountId): Promise<IRedisAccount> {
    const [
      account_id,
      updated_at_token,
      access_token,
      token_type,
      expires_in,
      refresh_token,
    ] = await this.redis.hmget(
      `token_oauth2_${accountId}`,
      'account_id',
      'updated_at_token',
      'access_token',
      'token_type',
      'expires_in',
      'refresh_token',
    );
    const res: IRedisAccount = {
      account_id,
      updated_at_token,
      access_token,
      token_type,
      expires_in,
      refresh_token,
    };
    return res;
  }
}
