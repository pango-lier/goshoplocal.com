import { Injectable } from '@nestjs/common';
import {
  Etsy,
  IListingInventoryProductOffering,
  IListingVariationImage,
  IShopListingWithAssociations,
} from 'etsy-ts/v3';
import {
  EXPORT_GOSHOPLOCAL_CSV_FIELDS,
  ExportListingCsv,
  PREFIX_UNIQUE_ETSY,
} from '../dto/export-listing-csv.dto';
import json2csv = require('json2csv');
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { ListingsService } from 'src/listings/listings.service';
import { TaxonomyService } from 'src/taxonomy/taxonomy.service';
import { FptFileService } from '../fpt-file/fpt-file.service';
import { CurrencyRatesService } from 'src/currency-rates/currency-rates.service';
import { Account } from 'src/accounts/entities/account.entity';
import { CreateListingDto } from 'src/listings/dto/create-listing.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import _ = require('lodash');
import { CoreApiService } from '../core-api/core-api.service';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';
import { delayMs } from 'src/utils/delay';
import slugify from 'slugify';

@Injectable()
export class CreateListingCsvService {
  constructor(
    private readonly listingService: ListingsService,
    private readonly taxonomyService: TaxonomyService,
    private readonly fptFileService: FptFileService,
    private readonly currencyService: CurrencyRatesService,
    private readonly coreApiService: CoreApiService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountsService,
    @InjectQueue('write-log') private readonly log: Queue,
  ) {}
  parseHeaderCsv(listing: IShopListingWithAssociations) {
    const headerCsv = EXPORT_GOSHOPLOCAL_CSV_FIELDS;
    if (listing?.inventory?.products[0]) {
      const product = listing.inventory.products[0];
      const property1 = product?.property_values[0]?.property_name;
      const property2 = product?.property_values[1]?.property_name;
      if (property1) {
        headerCsv.map((i) => {
          if (i.value === 'variation1')
            i.label = _.capitalize(property1.trim());
          return i;
        });
      }
      if (property2) {
        headerCsv.map((i) => {
          if (i.value === 'variation2')
            i.label = _.capitalize(property2.trim());
          return i;
        });
      }
    }
    return headerCsv;
  }

  async createCsv(
    element: IShopListingWithAssociations,
    variationImages: IListingVariationImage[],
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
          if (_offering.is_deleted === false && _offering.is_enabled === true) {
            if (_offering.price.currency_code.toUpperCase() === 'CAD')
              offering = _offering;
            else {
              const newAmount =
                await this.currencyService.convertCurrentDefault(
                  _offering.price.amount,
                  _offering.price.currency_code.toUpperCase(),
                );
              offering = {
                ..._offering,
                price: {
                  amount: newAmount,
                  divisor: _offering.price.divisor,
                  currency_code: 'CAD',
                },
              };
            }
          }
        }

        if (offering) {
          //property
          const variation1 =
            (product?.property_values[0]?.values?.join(',') || '') +
            ' ' +
            (product?.property_values[0]?.scale_name || '');
          const variation2 =
            (product?.property_values[1]?.values?.join(',') || '') +
            ' ' +
            (product?.property_values[1]?.scale_name || '');
          //images
          let images = element.images.map((i) => i.url_fullxfull);
          for (const variationImage of variationImages) {
            for (const [indexImage, imageItem] of element?.images?.entries() ||
              []) {
              if (
                imageItem.listing_image_id &&
                variationImage.image_id &&
                imageItem.listing_image_id === variationImage.image_id
              ) {
                for (const propertyValue of product?.property_values || []) {
                  if (
                    propertyValue.property_id &&
                    variationImage.property_id &&
                    propertyValue.property_id === variationImage.property_id
                  ) {
                    if (
                      variationImage?.value_id &&
                      propertyValue?.value_ids[0] &&
                      variationImage?.value_id === propertyValue?.value_ids[0]
                    ) {
                      delete images[indexImage];
                      images = images.filter((i) => i !== undefined);
                      images.unshift(imageItem.url_fullxfull);
                    }
                  }
                }
              }
            }
          }
          const exportCsv: ExportListingCsv = {
            sku: `${PREFIX_UNIQUE_ETSY}${product.product_id}`, //import from etsy
            category: taxonomy.name,
            title: element.title,
            description: element.description,
            vendor: vendor,
            tags: element.tags.join(','),
            variation1: variation1?.trim() || '',
            variation2: variation2?.trim() || '',
            variation3: '',
            prefixEtsyListingId: `${PREFIX_UNIQUE_ETSY}${element.listing_id}`,
            quantity: offering.quantity,
            offerPrice: '',
            actualPrice: (
              offering.price.amount / offering.price.divisor
            ).toFixed(2),
            variantShipping: '',
            variantImage: `Image for ${variation1?.trim() || ''} ${
              variation2?.trim() || ''
            }`,
            images: images.join('///'),
            varianTaxable:
              'GST,HST NB,QST,VAT,PST BC,PST NB,HST NL,HST NS,HST ONT,HST PEI,PST SK,PST MB',
          };
          fullCsv.push(exportCsv);
        } else {
          this.log.add('etsy-api', {
            status: 'warning',
            message: 'Offering not found ' + product.product_id,
          });
        }
      }
    }
    return fullCsv;
  }

  async getVariationImages(listing_id, etsy_user_id) {
    const { api, account } = await this.coreApiService.createApi(etsy_user_id);
    const listingVariationImages =
      await api.ShopListingVariationImage.getListingVariationImages(
        account.shop_id,
        listing_id,
      );
    return listingVariationImages?.data?.results || [];
  }

  async listingJsonParserCsv(
    listing: IShopListingWithAssociations,
    accountEntity: Account,
  ) {
    const headerCsv = this.parseHeaderCsv(listing);

    const listingVariationImages = await this.getVariationImages(
      listing.listing_id,
      accountEntity.etsy_user_id,
    );

    const fullCsv: ExportListingCsv[] = await this.createCsv(
      listing,
      listingVariationImages,
      accountEntity.vendor,
    );
    const json2csvParser = new json2csv.Parser({
      fields: headerCsv,
      delimiter: '\t',
    });
    const csv = json2csvParser.parse(fullCsv);
    return {
      csv,
      listingVariationImages,
      headerCsv,
      fullCsv,
    };
  }

  async createCsvFptFile(csv, path, dirLocal = '/tmp/goshoplocal') {
    let fileName = path;
    const folderArray = path.split('/');
    if (folderArray.length > 1) {
      fileName = folderArray[folderArray.length - 1];
      delete folderArray[folderArray.length - 1];
      dirLocal = dirLocal + '/' + folderArray.join('/');
      dirLocal = dirLocal.slice(0, -1);
    }
    if (!existsSync(`${dirLocal}`)) {
      mkdirSync(`${dirLocal}`, { recursive: true });
    }

    const fileLocal = `${dirLocal}/${fileName}`;
    writeFileSync(fileLocal, csv);
    await this.fptFileService.uploadFile(fileLocal, path);
    return csv;
  }

  async createOnceExportCsv(
    listing: IShopListingWithAssociations,
    accountEntity: Account,
    options: {
      mode: 'only_new' | 'update_and_new';
    },
  ) {
    let variationImages = null;
    const optionals: CreateListingDto = {};
    let csv;
    const create = await this.listingService.findOneBy({
      etsy_listing_id: listing.listing_id,
    });
    if (
      !create ||
      options.mode !== 'only_new' ||
      create?.status !== 'success'
    ) {
      try {
        const jsonParseCsv = await this.listingJsonParserCsv(
          listing,
          accountEntity,
        );
        csv = jsonParseCsv.csv;
        // const dateCreate = new Date();
        // const csvFile = `date_${dateCreate.getUTCFullYear()}_${dateCreate.getUTCMonth()}_${dateCreate.getUTCDate()}/listing_${
        //   listing.listing_id
        // }.csv`;
        const csvFile = `${this.configService.get(
          'fpt-goshoplocal.folder',
        )}/etsy/listing/listing_${listing.listing_id}.csv`;
        await this.createCsvFptFile(csv, csvFile);
        optionals.csvFile = csvFile;
        optionals.message = 'Create listing inventory is success !';
        optionals.status = 'success';
        variationImages = JSON.stringify(jsonParseCsv.listingVariationImages);
      } catch (error) {
        optionals.status = 'error';
        optionals.message = error.message || 'Some thing error .';
        this.log.add('createOnceExportCsv is error', {
          optionals: optionals,
        });
      }
      optionals.variationImages = variationImages;
      await this.listingService.sync(
        listing,
        accountEntity.id,
        optionals,
        create,
      );
    } else {
      // this.log.add('createOnceExportCsv', {
      //   message: `Listing ${listing.listing_id} is created Csv`,
      // });
    }
    return csv;
  }

  async syncListingCsv(accountEntity: Account) {
    // let variationImages = null;
    // const optionals: CreateListingDto = {};
    // let csv;
    // try {
    //   const jsonParseCsv = await this.listingJsonParserCsv(
    //     listing,
    //     accountEntity,
    //   );
    //   csv = jsonParseCsv.csv;
    //   const csvFile = `${this.configService.get(
    //     'fpt-goshoplocal.folder',
    //   )}/etsy/listing/listing_${listing.listing_id}.csv`;
    //   await this.createCsvFptFile(csv, csvFile);
    //   optionals.csvFile = csvFile;
    //   optionals.message = 'Create listing inventory is success !';
    //   optionals.status = 'success';
    //   variationImages = JSON.stringify(jsonParseCsv.listingVariationImages);
    // } catch (error) {
    //   optionals.status = 'error';
    //   optionals.message = error.message || 'Some thing error .';
    //   this.log.add('createOnceExportCsv is error', {
    //     optionals: optionals,
    //   });
    // }
    // optionals.variationImages = variationImages;
    // // await this.listingService.sync(
    // //   listing,
    // //   accountEntity.id,
    // //   optionals,
    // //   create,
    // // );
    // return csv;
  }

  async getAllListingActive(accountId) {
    let listings: IShopListingWithAssociations[] = [];
    const { api, account } = await this.coreApiService.createApi(accountId);
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

      listings = listings.concat(listing.data.results);
      await delayMs(300);
      pageCount++;
      count = listing?.data?.results.length || 0;
    } while (count >= 100);
    return listings;
  }

  async createListingVendorCsv(accountId) {
    const listings = await this.getAllListingActive(accountId);
    const { api, account } = await this.coreApiService.createApi(accountId);
    const accountEntity = await this.accountService.findEtsyUserId({
      etsy_user_id: account.account_id,
      active: true,
    });
    let fullCsv: ExportListingCsv[] = [];
    for (const listing of listings) {
      const variationImages =
        await api.ShopListingVariationImage.getListingVariationImages(
          account.shop_id,
          listing.listing_id,
        );

      const csv: ExportListingCsv[] = await this.createCsv(
        listing,
        variationImages?.data?.results || [],
        accountEntity.vendor,
      );
      await delayMs(300);
      fullCsv = fullCsv.concat(csv);
    }
    const json2csvParser = new json2csv.Parser({
      fields: EXPORT_GOSHOPLOCAL_CSV_FIELDS, //this.parseHeaderCsv(listing);
      delimiter: '\t',
    });
    await this.createCsvFptFile(
      json2csvParser.parse(fullCsv),
      `${slugify(accountEntity.vendor, '_')}.csv`,
    );
  }
}
