import { Injectable } from '@nestjs/common';
import { CreateEtsyApiDto } from './dto/create-etsy-api.dto';
import { UpdateEtsyApiDto } from './dto/update-etsy-api.dto';
import {
  Etsy,
  IListingInventoryProductOffering,
  IShopListingWithAssociations,
} from 'etsy-ts/v3';
import axios from 'axios';
import { OauthRedisService } from './oauth-redis/oauth-redis.service';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';
import { ListingsService } from 'src/listings/listings.service';
import { IRedisAccount } from './oauth-redis/oauth-redis.interface';
import {
  EXPORT_GOSHOPLOCAL_CSV_FIELDS,
  ExportListingCsv,
} from './dto/export-listing-csv.dto';
import { TaxonomyService } from 'src/taxonomy/taxonomy.service';
import json2csv = require('json2csv');
import {
  createReadStream,
  createWriteStream,
  writeFile,
  writeFileSync,
} from 'fs';

@Injectable()
export class EtsyApiService {
  constructor(
    private readonly oauthRedis: OauthRedisService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    private readonly listingService: ListingsService,
    private readonly taxonomyService: TaxonomyService,
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
      const data = await this.refreshToken(account.refresh_token, account);
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

  async createCsv(element: IShopListingWithAssociations, vendor: string) {
    const fullCsv: ExportListingCsv[] = [];
    const taxonomy = await this.taxonomyService.findOneOption({
      id: element.taxonomy_id,
    });
    for (const product of element?.inventory?.products) {
      if (product.is_deleted === false) {
        let offering: IListingInventoryProductOffering = undefined;
        for (const _offering of product.offerings) {
          if (
            _offering.is_deleted === false &&
            _offering.is_enabled === true &&
            _offering.price.currency_code.toLowerCase() === 'usd'
          ) {
            offering = _offering;
          }
        }
        if (offering) {
          const exportCsv: ExportListingCsv = {
            sku: product.sku,
            productName: element.title,
            description: element.description,
            upc: vendor,
            images: element.images.map((i) => i.url_fullxfull),
            price: (offering.price.amount / offering.price.divisor).toFixed(2),
            msrp: '',
            quantity: offering.quantity + '',
            mpn: '',
            noOfPieces: '',
            category: taxonomy.name,
          };
          fullCsv.push(exportCsv);
        }
      }
    }
    return fullCsv;
  }
  
  async createCsvFile(fullCsv: ExportListingCsv[]) {
    const json2csvParser = new json2csv.Parser({
      fields: EXPORT_GOSHOPLOCAL_CSV_FIELDS,
      delimiter: '\t',
    });
    const csv = json2csvParser.parse(fullCsv);
    const file = writeFileSync(
      `${__dirname}/listing${new Date().getTime()}.csv`,
      csv,
      {
        encoding: 'utf-8',
      },
    );

    return file;
  }

  async syncListing(accountId, options: any = {}) {
    const { api, account } = await this.createApi(accountId);
    const listing = await api.ShopListing.getListingsByShop({
      shopId: account.shop_id,
      state: options?.state || 'active',
      includes: ['Images', 'Inventory', 'Videos'],
    });
    const accountEntity = await this.accountService.findEtsyUserId({
      etsy_user_id: account.account_id,
      active: true,
    });
    const csvs = [];
    for (let index = 0; index < listing.data.results.length; index++) {
      const element = listing.data.results[index];
      const fullCsvs: ExportListingCsv[] = await this.createCsv(
        element,
        accountEntity.vendor,
      );
      const csv = await this.createCsvFile(fullCsvs);
      await this.listingService.sync(element, accountEntity.id);
      csvs.push(csv);
    }
    return csvs;
  }
}
