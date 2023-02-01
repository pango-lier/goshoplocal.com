import { Injectable } from '@nestjs/common';
import { OauthRedisService } from '../oauth-redis/oauth-redis.service';
import { ConfigService } from '@nestjs/config';
import { Etsy } from 'etsy-ts/v3';
import { IRedisAccount } from '../oauth-redis/oauth-redis.interface';
import axios from 'axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { delay } from 'src/utils/delay';

@Injectable()
export class CoreApiService {
  constructor(
    private readonly oauthRedis: OauthRedisService,
    private readonly configService: ConfigService,
    @InjectQueue('write-log') private readonly log: Queue,
  ) {}

  async createApi(accountId) {
    let account = await this.oauthRedis.getAccountTokens(accountId);
    if (
      +account.updated_at_token + +account.expires_in * 1000 - 1000 * 60 * 10 <
      new Date().getTime()
    ) {
      const data = await this.refreshToken(account.refresh_token, account);
      account = data;
    }
    const api = new Etsy({
      apiKey: this.configService.get('etsy.clientId'),
      accessToken: account.access_token,
    });
    api.httpClient.instance.interceptors.response.use(async (res) => {
      const rateLimit = await this.oauthRedis.setAccountApiEtsyLimit(
        res.headers,
        accountId,
      );
      if (rateLimit) {
        if (
          rateLimit.xRemainingThisSecond &&
          rateLimit.xRemainingThisSecond === 0
        ) {
          this.log.add('Warning-Etsy-Api-Rate-xRemainingThisSecond', rateLimit);
          await delay(5);
        }
        if (rateLimit.xRemainingToday && rateLimit.xRemainingToday === 100) {
          this.log.add('Warning-Etsy-Api-Rate-xRemainingToday', rateLimit);
        }
      }
      return res;
    });
    api.httpClient.instance.interceptors.request.use(async (request) => {
      await this.oauthRedis.getAccountApiEtsyLimit(accountId);
      return request;
    });
    return {
      api,
      account,
    };
  }

  async refreshToken(refreshToken: string, accountData: IRedisAccount) {
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.etsy.com/v3/public/oauth/token',
      data: {
        grant_type: 'refresh_token',
        client_id: this.configService.get('etsy.clientId'),
        refresh_token: refreshToken,
      },
    });
    return await this.oauthRedis.setRedisToken({
      ...accountData,
      ...response.data,
    });
  }
}
