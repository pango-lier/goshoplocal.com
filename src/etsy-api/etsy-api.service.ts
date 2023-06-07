import { Injectable } from '@nestjs/common';
import { CreateEtsyApiDto } from './dto/create-etsy-api.dto';
import { UpdateEtsyApiDto } from './dto/update-etsy-api.dto';
import { Etsy } from 'etsy-ts/v3';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateListingCsvService } from './create-listing-csv/create-listing-csv.service';
import { CoreApiService } from './core-api/core-api.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { delayMs } from 'src/utils/delay';
import { IsNull, Not } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ListingsService } from 'src/listings/listings.service';
import { ExportVendorOptions } from './dto/export-listing-csv.dto';

@Injectable()
export class EtsyApiService {
  constructor(
    private readonly coreApiService: CoreApiService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    private readonly listingCsv: CreateListingCsvService,
    private readonly listing: ListingsService,
    @InjectQueue('write-log') private readonly log: Queue,
    @InjectQueue('goshoplocal-listing-csv') private readonly goshoplocal: Queue,
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

  async getMe(access_token: string) {
    const api = new Etsy({
      apiKey: this.configService.get('etsy.clientId'),
      accessToken: access_token,
    });
    const response = await api.User.getMe();
    return response.data;
  }

  async syncAccount(accountId) {
    const { api, account } = await this.coreApiService.createApi(accountId);
    const user = await api.User.getUser(accountId);
    const shop = await api.Shop.getShop(account.shop_id);

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
      shop: JSON.stringify(shop?.data || ''),
    });
  }

  async syncListing(accountId) {
    const options: ExportVendorOptions = {
      isFullProduct: true,
    };
    await this.goshoplocal.add('import-csv-listing-vendor', {
      accountId,
      options,
    });
    return true;
    // return await this.CronImportCsvListingVendorJob();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'import-listing-goshoplocal',
    timeZone: 'America/New_York',
  })
  async CronImportCsvListingVendorJob() {
    const accounts = await this.accountService.findMany({
      active: true,
      etsy_user_id: Not(IsNull()),
    });
    await this.log.add('Start Cron: CronImportManyShopGoShopLocalJob', {
      accounts: accounts.map((i) => {
        return {
          id: i.id,
          accountId: i.etsy_user_id,
          name: i.name,
          active: i.active,
        };
      }),
    });
    for (const account of accounts) {
      await this.goshoplocal
        .add('import-receipt-vendor', {
          accountId: account.etsy_user_id,
        })
        .then(() => {
          return 1;
        });
    }

    return true;
  }

  async CronImportManyShopGoShopLocalJob() {
    const accounts = await this.accountService.findMany({
      active: true,
      etsy_user_id: Not(IsNull()),
    });
    await this.log.add('Start Cron: CronImportManyShopGoShopLocalJob', {
      accounts: accounts,
    });
    for (let index = 0; index < accounts.length; index++) {
      const account = accounts[index];
      try {
        await this.importOneShopGoShopLocalJob(account.etsy_user_id);
      } catch (error) {
        this.log.add('CronImportManyShopGoShopLocalJob is error .', {
          account,
        });
      }
    }
  }

  async importOneShopGoShopLocalJob(
    accountId,
    options: {
      mode: 'only_new' | 'update_and_new';
    } = { mode: 'only_new' },
  ) {
    const { api, account } = await this.coreApiService.createApi(accountId);
    const accountEntity = await this.accountService.findEtsyUserId({
      etsy_user_id: account.account_id,
      active: true,
    });
    let pageCount = 0;
    let count = 0;
    do {
      const listing = await api.ShopListing.getListingsByShop({
        shopId: account.shop_id,
        state: 'active',
        includes: ['Images', 'Inventory', 'Videos'],
        limit: 100,
        offset: pageCount * 100,
      });

      for (let index = 0; index < listing.data.results.length; index++) {
        const element = listing.data.results[index];
        await this.goshoplocal.add(
          'import-csv-listing',
          {
            listing: element,
            accountEntity,
            options,
          },
          {
            delay: 1000 * index,
          },
        );
      }
      await delayMs(300);
      pageCount++;
      count = listing?.data?.results.length || 0;
    } while (count >= 100);
    return true;
  }

  async createListingCsv(id) {
    const listingData = await this.listing.findOne(id);
    const { api, account } = await this.coreApiService.createApi(
      listingData.account.etsy_user_id,
    );
    const accountEntity = await this.accountService.findEtsyUserId({
      etsy_user_id: account.account_id,
      active: true,
    });

    const listing = await api.ShopListing.getListing({
      listingId: listingData.etsy_listing_id,
      includes: ['Images', 'Inventory', 'Videos'],
    });
    const { csv, headerCsv, fullCsv } =
      await this.listingCsv.listingJsonParserCsv(listing.data, accountEntity);

    return { csv, headerCsv, fullCsv };
  }
}
