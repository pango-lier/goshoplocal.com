import { Injectable } from '@nestjs/common';
import {
  Etsy,
  IListingInventory,
  IListingInventoryProductOffering,
  IListingVariationImage,
  IShopListingWithAssociations,
} from 'etsy-ts/v3';
import {
  EXPORT_GOSHOPLOCAL_CSV_FIELDS,
  ExportListingCsv,
  ExportVendorOptions,
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
import { Listing } from 'src/listings/entities/listing.entity';
import { CurrencyRate } from 'src/currency-rates/entities/currency-rate.entity';
import { MailService } from 'src/mail/mail.service';

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
    private readonly mail: MailService,
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

  parseFullHeaderCsv(listings: IShopListingWithAssociations[]) {
    const properties = [];
    let headerCsvs = [
      {
        label: 'Product Code',
        value: 'sku',
      },
      {
        label: 'Etsy Category',
        value: 'category',
      },
      {
        label: 'Title (Product Name)',
        value: 'title',
      },
      {
        label: 'Body (HTML)',
        value: 'description',
      },
      {
        label: 'Vendor Name',
        value: 'vendor',
      },
      {
        label: 'Tags',
        value: 'tags',
      },
    ];
    listings.forEach((listing) => {
      if (listing?.inventory?.products[0]) {
        const product = listing.inventory.products[0];
        const property1 = product?.property_values[0]?.property_name;
        const property2 = product?.property_values[1]?.property_name;
        if (
          property1 &&
          property1 !== undefined &&
          property1 !== null &&
          property1.trim() !== ''
        ) {
          const key1 = _.capitalize(property1.trim());
          // console.log(property1, key1);
          if (key1 && !properties.includes(key1)) {
            properties.push(key1);
            let label = key1;
            if (['color', 'colors'].includes(key1.toLowerCase())) {
              label = 'Colour';
            }
            headerCsvs.push({
              label,
              value: property1.trim(),
            });
          }
        }
        if (
          property2 &&
          property2 !== undefined &&
          property2 !== null &&
          property2.trim() !== ''
        ) {
          const key2 = _.capitalize(property2.trim());
          // console.log(property1, key2);
          if (key2 && !properties.includes(key2)) {
            properties.push(key2);
            let label = key2;
            if (['color', 'colors'].includes(key2.toLowerCase())) {
              label = 'Colour';
            }
            headerCsvs.push({
              label,
              value: property2.trim(),
            });
          }
        }
      }
    });
    headerCsvs = headerCsvs.concat([
      {
        label: 'Variation Group Code',
        value: 'prefixEtsyListingId', //prefix et
      },
      {
        label: 'Variant Inventory Qty',
        value: 'quantity',
      },
      {
        label: 'Variant Price (Offer Price) ',
        value: 'offerPrice',
      },
      {
        label: 'Variant Compare At Price (Actual Variant Price)',
        value: 'actualPrice',
      },
      {
        label: 'Variant Requires Shipping',
        value: 'variantShipping',
      },
      {
        label: 'Variant Image',
        value: 'variantImage',
      },
      {
        label: 'Images',
        value: 'images',
      },
      {
        label: 'Variant Taxable',
        value: 'varianTaxable',
      },
      {
        label: 'Status',
        value: 'status',
      },
    ]);
    return { properties, headerCsvs };
  }

  async getOffering(
    offerings: IListingInventoryProductOffering[],
    currencyRates: CurrencyRate[],
  ) {
    let offering: IListingInventoryProductOffering = undefined;
    for (const _offering of offerings) {
      if (_offering.price.currency_code.toUpperCase() === 'CAD')
        offering = _offering;
      else {
        const currencyRate = currencyRates.find(
          (i) =>
            i.currencyCode.toUpperCase() ===
            _offering.price.currency_code.toUpperCase(),
        );
        if (!currencyRate) {
          this.log.add('getOffering is error', {
            message: 'getOffering find not found .',
          });
          return undefined;
        }
        offering = {
          ..._offering,
          price: {
            amount: _offering.price.amount / currencyRate.rate,
            divisor: _offering.price.divisor,
            currency_code: 'CAD',
          },
        };
      }
      if (
        offering &&
        _offering.is_deleted === false &&
        _offering.is_enabled === true
      ) {
        return offering;
      }
    }
    return offering;
  }

  checkNewListingChange(
    listing: IShopListingWithAssociations,
    listingLocal: Listing,
    vendor: string,
  ) {
    if (!listingLocal) return true;
    if (listing.title.trim() != listingLocal.title.trim()) return true;
    if (listing.description.trim() != listingLocal.description.trim())
      return true;
    if (listing.taxonomy_id != listingLocal.taxonomy_id) return true;
    if (JSON.stringify(listing.images) != JSON.stringify(listingLocal.images))
      return true;
    if (JSON.stringify(listing.tags) != JSON.stringify(listingLocal.tags))
      return true;
    if (
      JSON.stringify(listing.inventory) !=
      JSON.stringify(listingLocal.inventory)
    )
      return true;
    if (vendor != listingLocal?.vendor) return true;

    return false;
  }

  async createCsv(
    element: IShopListingWithAssociations,
    variationImages: IListingVariationImage[],
    vendor: string,
    listingLocal: Listing,
    currencyRates: CurrencyRate[],
    isListingDeleted = false,
  ) {
    const fullCsv: ExportListingCsv[] = [];
    const taxonomy = await this.taxonomyService.findOneOption({
      id: element.taxonomy_id,
    });

    for (const product of element?.inventory?.products) {
      let status = 'R';
      if (listingLocal) {
        const inventory = listingLocal?.inventory as IListingInventory;
        if (inventory?.products) {
          const checkStatus = inventory.products.find(
            (i) => i.product_id == product.product_id,
          );
          if (checkStatus) status = '';
        }
      }

      // if (product.is_deleted === false) {
      const offering = await this.getOffering(product.offerings, currencyRates);

      if (offering) {
        const property1 = product?.property_values[0]?.property_name;
        const property2 = product?.property_values[1]?.property_name;
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
        let variantImage = '';
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
                    variantImage = imageItem.url_fullxfull;
                  }
                }
              }
            }
          }
        }
        const exportCsv: ExportListingCsv = {
          sku: `${PREFIX_UNIQUE_ETSY}${PREFIX_UNIQUE_ETSY}${slugify(
            vendor,
            '_',
          )}${product.product_id}`, //import from etsy
          category: taxonomy.name,
          title: element.title,
          description: element.description,
          vendor: vendor,
          tags: element.tags.join(','),
          [variation1]: variation1?.trim() || '',
          [variation2]: variation2?.trim() || '',
          prefixEtsyListingId: `${PREFIX_UNIQUE_ETSY}${slugify(vendor, '_')}${
            element.listing_id
          }`,
          quantity: offering.quantity,
          offerPrice: '',
          status:
            isListingDeleted === true ||
            product.is_deleted === true ||
            offering.is_deleted === true ||
            offering.is_enabled === false
              ? 'H'
              : status,
          actualPrice: (offering.price.amount / offering.price.divisor).toFixed(
            2,
          ),
          variantShipping: '',
          variantImage,
          images: images.join('///'),
          varianTaxable:
            'GST,HST NB,QST,VAT,PST BC,PST NB,HST NL,HST NS,HST ONT,HST PEI,PST SK,PST MB',
        };
        if (variation1?.trim()) {
          exportCsv[property1.trim()] = variation1?.trim();
        }
        if (variation2?.trim()) {
          exportCsv[property2.trim()] = variation2?.trim();
        }
        fullCsv.push(exportCsv);
      } else {
        this.log.add('etsy-api', {
          status: 'warning',
          message: 'Offering not found ' + product.product_id,
        });
      }
      // }
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
    const currencyRates = await this.currencyService.findAll();
    const fullCsv: ExportListingCsv[] = await this.createCsv(
      listing,
      listingVariationImages,
      accountEntity.vendor,
      undefined,
      currencyRates,
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
        accountEntity.vendor,
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
      if (pageCount > 95) {
        this.log.add('getAllListingActive-Too-Many-Listing', {
          accountId,
          message: 'Listing is more than 9500 listing',
        });
        break;
      }
    } while (count >= 100);
    return listings;
  }

  async getFullCsvDeleteds(
    listings: IShopListingWithAssociations[],
    accountEntity: Account,
    currencyRates: CurrencyRate[],
  ) {
    let fullCsv: ExportListingCsv[] = [];
    const listingLocals = await this.listingService.getListingIdsByStatus(
      accountEntity.id,
    );

    const listingDeleteds: Listing[] = [];
    for (const item of listingLocals) {
      const check = listings.find((i) => i.listing_id == item.etsy_listing_id);
      if (check === undefined) {
        const listing: IShopListingWithAssociations = {
          tags: item.tags as any,
          images: item.images as any,
          inventory: item.inventory as any,
          taxonomy_id: item.taxonomy_id,
          listing_id: item.etsy_listing_id,
          title: item.title,
          description: item.description,
        };
        const csv: ExportListingCsv[] = await this.createCsv(
          listing,
          item.variationImages as any,
          accountEntity.vendor,
          undefined,
          currencyRates,
          true,
        );
        fullCsv = fullCsv.concat(csv);
        listingDeleteds.push(item);
      }
    }

    return { fullCsv, listingDeleteds, listingLocals };
  }

  async updateListingDb(
    listingUpdates: {
      listing: IShopListingWithAssociations;
      variationImages: IListingVariationImage[];
      listingLocal: Listing;
    }[],
    listingDeleted: Listing[],
    accountEntity: Account,
  ) {
    try {
      for (const listingUpdate of listingUpdates) {
        const optionals: CreateListingDto = {};
        optionals.message = 'Create listing inventory is success !';
        optionals.status = 'success';
        optionals.variationImages = JSON.stringify(
          listingUpdate.variationImages,
        );
        await this.listingService.sync(
          listingUpdate.listing,
          accountEntity.id,
          accountEntity.vendor,
          optionals,
          listingUpdate.listingLocal,
        );
      }

      if (listingDeleted.length > 0) {
        await this.listingService.updateStatusListingId(
          listingDeleted.map((i) => i.id),
          {
            status: 'deleted',
            message: 'Listing is not found !',
          },
        );
      }
    } catch (error) {
      this.log.add('updateListingDb', { message: error?.message || '' });
    }
  }

  async createListingVendorCsv(
    accountId,
    options: ExportVendorOptions = { isFullProduct: false },
  ) {
    const listings = await this.getAllListingActive(accountId);
    const { api, account } = await this.coreApiService.createApi(accountId);
    const accountEntity = await this.accountService.findEtsyUserId({
      etsy_user_id: account.account_id,
      active: true,
    });
    const currencyRates = await this.currencyService.findAll();
    const listingDeleted = await this.getFullCsvDeleteds(
      listings,
      accountEntity,
      currencyRates,
    );

    let fullCsv: ExportListingCsv[] = listingDeleted.fullCsv;
    const listingUpdate: {
      listing: IShopListingWithAssociations;
      variationImages: IListingVariationImage[];
      listingLocal: Listing;
    }[] = [];
    for (const listing of listings) {
      const variationImages =
        await api.ShopListingVariationImage.getListingVariationImages(
          account.shop_id,
          listing.listing_id,
        );
      const listingLocal = listingDeleted.listingLocals.find(
        (i) => i.etsy_listing_id == listing.listing_id,
      );
      if (
        options.isFullProduct ||
        this.checkNewListingChange(listing, listingLocal, accountEntity.vendor)
      ) {
        const csv: ExportListingCsv[] = await this.createCsv(
          listing,
          variationImages?.data?.results || [],
          accountEntity.vendor,
          listingLocal,
          currencyRates,
        );

        fullCsv = fullCsv.concat(csv);
        listingUpdate.push({
          listing,
          variationImages: variationImages?.data?.results || [],
          listingLocal,
        });
      }
      await delayMs(200);
    }

    const json2csvParser = new json2csv.Parser({
      fields: this.parseFullHeaderCsv(listings).headerCsvs,
      delimiter: '\t',
    });
    const csvFileName = `${slugify(accountEntity.vendor.toLowerCase(), '_')}_${
      accountEntity.etsy_user_id
    }.csv`;
    const csvFile = `${this.configService.get(
      'fpt-goshoplocal.folder',
    )}/etsy/listing/${csvFileName}`;
    await this.createCsvFptFile(json2csvParser.parse(fullCsv), csvFile);
    this.mail.sendAdminCreatedListingCsv(accountEntity, csvFileName);
    await this.updateListingDb(
      listingUpdate,
      listingDeleted.listingDeleteds,
      accountEntity,
    );
    return {
      vendor: accountEntity.vendor,
      csvFile,
      status: 'success',
    };
  }
}
