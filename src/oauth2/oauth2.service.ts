import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createHash, randomBytes } from 'crypto';
import { AccountsService } from 'src/accounts/accounts.service';
import { EtsyApiService } from '../etsy-api/etsy-api.service';

@Injectable()
export class Oauth2Service {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    private readonly etsyApi: EtsyApiService,
  ) {}
  // Step 1: Authorization Code
  async getUrlRedirect() {
    const state = this.generateState();
    const codeVerifier = this.generateVerifier();
    console.log(state, codeVerifier);
    await this.redis.hset('state_oauth2', state, 1);
    await this.redis.hset('code_verifier_oauth2', state, codeVerifier);
    return this.getCoreUrlRedirect(codeVerifier, state);
  }

  private getCoreUrlRedirect(codeVerifier, state) {
    const codeChallenge = this.generateS256Challenge(codeVerifier);
    const query = new URLSearchParams({
      response_type: 'code',
      redirect_uri: this.configService.get('etsy.redirectUri'),
      scope: this.configService.get('etsy.scope'),
      client_id: this.configService.get('etsy.clientId'),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }).toString();
    return 'https://www.etsy.com/oauth/connect?' + query;
  }

  // Step 2: Grant Access#
  async getAccessToken(state, code) {
    if (
      !(await this.redis.hexists('state_oauth2', state)) &&
      !(await this.redis.hexists('code_verifier_oauth2', state))
    ) {
      throw new Error('State not match');
    }
    const codeVerifier = await this.redis.hget('code_verifier_oauth2', state);
    this.redis.hdel('state_oauth2', state);
    this.redis.hdel('code_verifier_oauth2', state);
    return await this.requestGetAccessToken(codeVerifier, code);
  }

  async requestGetAccessToken(codeVerifier, code) {
    const res = await axios.request({
      method: 'POST',
      url: 'https://api.etsy.com/v3/public/oauth/token',
      data: {
        grant_type: 'authorization_code',
        client_id: this.configService.get('etsy.clientId'),
        redirect_uri: this.configService.get('etsy.redirectUri'),
        code_verifier: codeVerifier,
        code: code,
      },
    });
    console.log(res.data);
    await this.setRedisToken(res.data);
    const [account] = res.data.access_token.split('.');
    await this.etsyApi.syncAccount(account);

    return res;
  }

  async setRedisToken(data) {
    const [account] = data.access_token.split('.');
    console.log(`token_oauth2_${account}`);
    await this.redis.hmset(`token_oauth2_${account}`, {
      account_id: account,
      updated_at_token: new Date().getTime(),
      ...data,
    });
  }

  base64URLEncode = (str) =>
    str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  sha256 = (buffer) => createHash('sha256').update(buffer).digest();
  generateS256Challenge = (verifier) =>
    this.base64URLEncode(this.sha256(verifier));
  generateState = () => Math.random().toString(36).substring(7);
  generateVerifier = () => this.base64URLEncode(randomBytes(32));
}
