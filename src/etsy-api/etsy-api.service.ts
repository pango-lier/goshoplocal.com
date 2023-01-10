import { Injectable } from '@nestjs/common';
import { CreateEtsyApiDto } from './dto/create-etsy-api.dto';
import { UpdateEtsyApiDto } from './dto/update-etsy-api.dto';
import { Etsy } from 'etsy-ts/v3';
import axios from 'axios';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';
import { ListingsService } from 'src/listings/listings.service';

@Injectable()
export class EtsyApiService {
  constructor(
    private readonly oauthRedis: OauthRedisService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    private readonly listingService: ListingsService,
  ) {}

  create(createEtsyApiDto: CreateEtsyApiDto) {
    return 'This action adds a new etsyApi';
  }

  async findAll() {}

  findOne(id: number) {
    return `This action returns a #${id} etsyApi`;
  }

  update(id: number, updateEtsyApiDto: UpdateEtsyApiDto) {
    return `This action updates a #${id} etsyApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} etsyApi`;
  }

  private async createApi(accountId) {
    let account = await this.oauthRedis.getAccountTokens(accountId);
    if (
      +account.updated_at_token + +account.expires_in * 1000 - 1000 * 60 * 10 <
      new Date().getTime()
    ) {
      const data = await this.refreshToken(account.refresh_token);
      console.log('refresh-token', data, account);
      account = data;
    }
    const api = new Etsy({
      apiKey: this.configService.get('etsy.clientId'),
      accessToken: account.access_token,
    });
    return {
      api,
      account,
    };
  }

  async refreshToken(refreshToken: string) {
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.etsy.com/v3/public/oauth/token',
      data: {
        grant_type: 'refresh_token',
        client_id: this.configService.get('etsy.clientId'),
        refresh_token: refreshToken,
      },
    });
    return await this.oauthRedis.setRedisToken({ ...response.data });
  }

  async getMe(access_token: string) {
    const api = new Etsy({
      apiKey: this.configService.get('etsy.clientId'),
      accessToken: access_token,
    });
    const response = await api.User.getMe();
    return response.data;
  }

  async syncAccount(accountId) {
    const { api, account } = await this.createApi(accountId);
    const user = await api.User.getUser(accountId);
    return await this.accountService.sync({
      etsy_user_id: user.data.user_id,
      first_name: user.data.first_name,
      last_name: user.data.last_name,
      image_url_75x75: user.data.image_url_75x75,
      primary_email: user.data.primary_email,
      name: `${user.data.first_name} ${user.data.last_name}`,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      scope: account.scope,
      vendor: account.vendor,
      shop_id: account.shop_id,
    });
  }

  async syncListing(accountId) {
    const { api, account } = await this.createApi(accountId);
    const listing = await api.ShopListing.getListingsByShop({
      shopId: account.shop_id,
      state: 'active',
      includes: ['Images', 'Inventory', 'Videos'],
    });
    const accountEntity = await this.accountService.findEtsyUserId(
      account.account_id,
    );
    for (let index = 0; index < listing.data.results.length; index++) {
      const element = listing.data.results[index];

      await this.listingService.sync(element, accountEntity.id);
    }
    return listing.data;
  }
}
