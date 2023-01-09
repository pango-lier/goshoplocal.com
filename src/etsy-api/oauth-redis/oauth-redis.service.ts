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
      scope,
      vendor,
      shop_id,
    ] = await this.redis.hmget(
      `token_oauth2_${accountId}`,
      'account_id',
      'updated_at_token',
      'access_token',
      'token_type',
      'expires_in',
      'refresh_token',
      'scope',
      'vendor',
      'shop_id',
    );
    const res: IRedisAccount = {
      account_id: +account_id,
      updated_at_token: +updated_at_token,
      access_token,
      token_type,
      expires_in: +expires_in,
      refresh_token,
      scope,
      vendor,
      shop_id: +shop_id,
    };
    return res;
  }

  async setRedisToken(data) {
    const [account] = data.access_token.split('.');
    const response = {
      account_id: account,
      updated_at_token: new Date().getTime(),
      ...data,
    };
    await this.redis.hmset(`token_oauth2_${account}`, response);
    return response;
  }
}
