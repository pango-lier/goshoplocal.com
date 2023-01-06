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
  async getUrlRedirect(scope, vendor) {
    const state = this.generateState();
    const codeVerifier = this.generateVerifier();
    await this.redis.hset('state_oauth2', state, 1);
    await this.redis.hset('code_verifier_oauth2', state, codeVerifier);
    await this.redis.hset('scope_oauth2', state, scope);
    await this.redis.hset('vendor_oauth2', state, vendor);
    return this.getCoreUrlRedirect(codeVerifier, state, scope);
  }

  private getCoreUrlRedirect(codeVerifier, state, scope) {
    const codeChallenge = this.generateS256Challenge(codeVerifier);
    const query = new URLSearchParams({
      response_type: 'code',
      redirect_uri: this.configService.get('etsy.redirectUri'),
      scope: scope,
      client_id: this.configService.get('etsy.clientId'),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }).toString();
    return 'https://www.etsy.com/oauth/connect?' + query;
  }

  // Step 2: Grant Access#
  async getAccessToken(state, code) {
    try {
      if (
        !(await this.redis.hexists('state_oauth2', state)) &&
        !(await this.redis.hexists('code_verifier_oauth2', state))
      ) {
        throw new Error('State not match');
      }
      const codeVerifier = await this.redis.hget('code_verifier_oauth2', state);
      const scope = await this.redis.hget('scope_oauth2', state);
      const vendor = await this.redis.hget('vendor_oauth2', state);
      this.redis.hdel('vendor_oauth2', state);
      this.redis.hdel('scope_oauth2', state);
      this.redis.hdel('state_oauth2', state);
      this.redis.hdel('code_verifier_oauth2', state);
      await this.requestGetAccessToken(codeVerifier, code, scope, vendor);
      return this.configService.get('etsy.redirectUriSuccess');
    } catch (error) {
      return `${this.configService.get(
        'etsy.redirectUriError',
      )}?error_message=${error.message}`;
    }
  }

  async requestGetAccessToken(codeVerifier, code, scope, vendor) {
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
    await this.setRedisToken({ ...res.data, scope, vendor });
    const [account] = res.data.access_token.split('.');
    await this.etsyApi.syncAccount(account);

    return res;
  }

  async setRedisToken(data) {
    const [account] = data.access_token.split('.');
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
