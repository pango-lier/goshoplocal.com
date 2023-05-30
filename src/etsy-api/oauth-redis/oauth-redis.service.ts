import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { IRedisAccount, IRedisLimit } from './oauth-redis.interface';

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

  async setRedisToken(data: IRedisAccount) {
    const [account] = data.access_token.split('.');
    const response = {
      account_id: account,
      updated_at_token: new Date().getTime(),
      ...data,
    };
    await this.redis.hmset(`token_oauth2_${account}`, response);
    return response;
  }

  async getAccountApiEtsyLimit(accountId): Promise<IRedisLimit> {
    try {
      const [
        account_id,
        xLimitPerSecond,
        xRemainingThisSecond,
        xLimitPerDay,
        xRemainingToday,
      ] = await this.redis.hmget(
        `token_oauth2_etsy_limit_${accountId}`,
        'account_id',
        'xLimitPerSecond',
        'xRemainingThisSecond',
        'xLimitPerDay',
        'xRemainingToday',
      );
      const res: IRedisLimit = {
        account_id: parseInt(account_id),
        xLimitPerSecond: parseInt(xLimitPerSecond),
        xRemainingThisSecond: parseInt(xRemainingThisSecond),
        xLimitPerDay: parseInt(xLimitPerDay),
        xRemainingToday: parseInt(xRemainingToday),
      };
      return res;
    } catch (error) {}
    return undefined;
  }

  async setAccountApiEtsyLimit(headers, account_id: number | string) {
    try {
      const response: IRedisLimit = {
        account_id: account_id as number,
        xLimitPerSecond: headers['x-limit-per-second'],
        xRemainingThisSecond: headers['x-remaining-this-second'],
        xLimitPerDay: headers['x-limit-per-day'],
        xRemainingToday: headers['x-remaining-today'],
      };
      await this.redis.hmset(`token_oauth2_etsy_limit_${account_id}`, response);
      return response;
    } catch (error) {}
  }
}
