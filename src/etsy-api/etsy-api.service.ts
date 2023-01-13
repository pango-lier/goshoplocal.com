import { Injectable } from '@nestjs/common';
import { CreateEtsyApiDto } from './dto/create-etsy-api.dto';
import { UpdateEtsyApiDto } from './dto/update-etsy-api.dto';
import {
  Etsy,
  IListingInventoryProductOffering,
  IListingVariationImages,
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
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { FptFileService } from './fpt-file/fpt-file.service';
import { CreateListingDto } from 'src/listings/dto/create-listing.dto';

@Injectable()
export class EtsyApiService {
  constructor(
    private readonly oauthRedis: OauthRedisService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    private readonly listingService: ListingsService,
    private readonly taxonomyService: TaxonomyService,
    private readonly fptFileService: FptFileService,
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

  async createCsv(
    element: IShopListingWithAssociations,
    variationImages: IListingVariationImages,
    vendor: string,
  ) {
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
          const images = element.images.map((i) => i.url_fullxfull);
          const exportCsv: ExportListingCsv = {
            sku: `iet${product.sku}`, //import from etsy
            productName: element.title,
            description: element.description,
            upc: vendor,
            image1: images[0],
            image2: images[1] || '',
            image3: images[2] || '',
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

  async createCsvFile(
    fullCsv: ExportListingCsv[],
    path,
    dirLocal = '/tmp/goshoplocal',
  ) {
    const json2csvParser = new json2csv.Parser({
      fields: EXPORT_GOSHOPLOCAL_CSV_FIELDS,
      delimiter: '\t',
    });
    const csv = json2csvParser.parse(fullCsv);
    let fileName = path;
    const folderArray = path.split('/');
    if (folderArray.length > 1) {
      fileName = folderArray[folderArray.length - 1];
      delete folderArray[folderArray.length - 1];
      dirLocal = dirLocal + '/' + folderArray.join('/');
      dirLocal = dirLocal.slice(0, -1);
    }
    if (!existsSync(`${dirLocal}`)) {
      mkdirSync(`${dirLocal}`);
    }

    const fileLocal = `${dirLocal}/${fileName}`;
    writeFileSync(fileLocal, csv);
    await this.fptFileService.uploadFile(fileLocal, path);
    return csv;
  }

  async createOnceExportCsv(listing, accountEntity, account, api) {
    let variationImages = null;
    const options: CreateListingDto = {};
    let csv;
    try {
      const listingVariationImages =
        await api.ShopListingVariationImage.getListingVariationImages(
          account.shop_id,
          listing.listing_id,
        );
      console.log(listingVariationImages.data.results);

      const fullCsvs: ExportListingCsv[] = await this.createCsv(
        listing,
        variationImages,
        accountEntity.vendor,
      );
      const dateCreate = new Date();
      const csvFile = `date_${dateCreate.getUTCFullYear()}_${dateCreate.getUTCMonth()}_${dateCreate.getUTCDate()}/listing_${
        listing.listing_id
      }.csv`;
      csv = await this.createCsvFile(fullCsvs, csvFile);
      options.csvFile = csvFile;
      options.message = 'Create listing inventory is success !';
      options.status = 'success';
      variationImages = JSON.stringify(listingVariationImages.data.results);
    } catch (error) {
      options.status = 'error';
      options.message = error.message || 'Some thing error .';
    }
    options.variationImages = variationImages;
    await this.listingService.sync(listing, accountEntity.id, options);
    return csv;
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
      const csv = await this.createOnceExportCsv(
        element,
        accountEntity,
        account,
        api,
      );
      csvs.push(csv);
    }
    return csvs;
  }
}
