import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { IPaginate } from 'src/paginate/paginate.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { FindOptionsWhere, Repository, UpdateQueryBuilder } from 'typeorm';
import { PaginateService } from 'src/paginate/paginate.service';
import { IShopListingWithAssociations } from 'etsy-ts/v3';
import { Receipt } from './entities/receipt.entity';
@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listing: Repository<Listing>,
    @InjectRepository(Receipt) private readonly receipt: Repository<Receipt>,
    private readonly paginateService: PaginateService,
  ) { }

  async syncReceipt(createListingDto: any) {
    const receipt = await this.receipt.findOneBy({ id: createListingDto.id });
    if (!receipt) {
      const _receipt = this.receipt.create(createListingDto);
     return await this.receipt.save(_receipt);
    }

    return await this.receipt.save({ ...receipt, orders:createListingDto.orders });
  }

  create(createListingDto: CreateListingDto) {
    const listing = this.listing.create(createListingDto);
    return this.listing.save(listing);
  }

  findAll(paginate: IPaginate) {
    const query = this.listing.createQueryBuilder('listing');
    query.select(
      'listing.id as id,listing.createdAt as createdAt,listing.message as message,listing.status as status,listing.state as state,listing.description as description,listing.images as images, listing.etsy_user_id as etsy_user_id, listing.title as title, listing.etsy_listing_id as etsy_listing_id, listing.price as price,listing.quantity as quantity, listing.shop_id as shop_id, listing.taxonomy_id as taxonomy_id, listing.url as url',
    );
    query.leftJoinAndSelect('listing.userb', 'userb');
    query.leftJoinAndSelect('listing.taxonomyb', 'taxonomyb');
    query.leftJoinAndSelect('listing.account', 'account');
    return this.paginateService.queryFilter(query, paginate, [
      'listing.title',
      'listing.etsy_user_id',
    ]);
  }

  async findOne(id: number) {
    return await this.listing.findOne({
      where: {
        id,
      },
      relations: {
        account: true,
      },
    });
  }

  async getListingIdsByStatus(accountId, status = 'success') {
    return await this.listing.find({
      where: {
        status,
        accountId,
      },
    });
  }

  async findOneBy(
    option: FindOptionsWhere<Listing> | FindOptionsWhere<Listing>[],
  ) {
    return await this.listing.findOneBy(option);
  }

  async updateStatusListingId(ids: number[], options) {
    return await this.listing
      .createQueryBuilder('listing')
      .update(Listing)
      .set(options)
      .whereInIds(ids)
      .execute();
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  remove(id: number) {
    return this.listing.softDelete({ id });
  }

  async sync(
    data: IShopListingWithAssociations,
    accountId,
    vendor: string,
    options: CreateListingDto = {},
    create,
  ) {
    const {
      listing_id,
      user_id,
      materials,
      style,
      shipping_profile,
      when_made,
      tags,
      price,
      user,
      shop,
      images,
      inventory,
      production_partners,
      translations,
      skus,
      ...rest
    } = data;
    //   const whenMake = when_made === '2020_2022' ? '2020_2023' : when_made;
    const createAccountDto: CreateListingDto = {
      etsy_listing_id: listing_id,
      accountId,
      etsy_user_id: user_id,
      materials: JSON.stringify(materials),
      style: JSON.stringify(style),
      //  shipping_profile: JSON.stringify(shipping_profile),
      when_made,
      tags: JSON.stringify(tags),
      price: JSON.stringify(price),
      //  user: JSON.stringify(user),
      //   shop: JSON.stringify(shop),
      images: JSON.stringify(images),
      inventory: JSON.stringify(inventory),
      production_partners: JSON.stringify(production_partners),
      //  translations: JSON.stringify(translations),
      skus: JSON.stringify(skus),
      vendor,
      ...rest,
      ...options,
    };
    // const create = await this.listing.findOneBy({
    //   etsy_listing_id: listing_id,
    // });
    if (!create) {
      return await this.create(createAccountDto);
    } else {
      create.accountId = createAccountDto.accountId;
      create.created_timestamp = createAccountDto.created_timestamp;
      create.creation_timestamp = createAccountDto.creation_timestamp;
      create.description = createAccountDto.description;
      create.ending_timestamp = createAccountDto.ending_timestamp;
      create.etsy_listing_id = createAccountDto.etsy_listing_id;
      create.featured_rank = createAccountDto.featured_rank;
      create.file_data = createAccountDto.file_data;
      create.has_variations = createAccountDto.has_variations;
      create.images = createAccountDto.images;
      create.inventory = createAccountDto.inventory;
      create.is_customizable = createAccountDto.is_customizable;
      create.is_personalizable = createAccountDto.is_personalizable;
      create.is_private = createAccountDto.is_private;
      create.is_supply = createAccountDto.is_supply;
      create.is_taxable = createAccountDto.is_taxable;
      create.item_dimensions_unit = createAccountDto.item_dimensions_unit;
      create.item_height = createAccountDto.item_height;
      create.item_length = createAccountDto.item_length;
      create.item_weight = createAccountDto.item_weight;
      create.item_weight_unit = createAccountDto.item_weight_unit;
      create.item_width = createAccountDto.item_width;
      create.language = createAccountDto?.language || null;
      create.last_modified_timestamp = createAccountDto.last_modified_timestamp;
      create.listing_type = createAccountDto.listing_type;
      create.materials = createAccountDto.materials;
      create.non_taxable = createAccountDto.non_taxable;
      create.num_favorers = createAccountDto.num_favorers;
      create.original_creation_timestamp =
        createAccountDto.original_creation_timestamp;
      create.personalization_char_count_max =
        createAccountDto.personalization_char_count_max;
      create.personalization_instructions =
        createAccountDto.personalization_instructions;
      create.personalization_is_required =
        createAccountDto.personalization_is_required;
      create.price = createAccountDto.price;
      create.processing_max = createAccountDto.processing_max;
      create.processing_min = createAccountDto.processing_min;
      create.production_partners =
        createAccountDto?.production_partners || null;
      create.quantity = createAccountDto.quantity;
      create.return_policy_id = createAccountDto?.return_policy_id || null;
      create.shipping_profile = createAccountDto?.shipping_profile || null; //
      create.shipping_profile_id = createAccountDto.shipping_profile_id;
      create.shop = createAccountDto?.shop || null;
      create.shop_id = createAccountDto.shop_id;
      create.shop_section_id = createAccountDto.shop_section_id;
      create.should_auto_renew = createAccountDto.should_auto_renew;
      create.skus = createAccountDto.skus;
      create.state = createAccountDto.state;
      create.state_timestamp = createAccountDto.state_timestamp;
      //create.status = createAccountDto.status;
      create.style = createAccountDto.style;
      create.tags = createAccountDto.tags;
      create.taxonomy = createAccountDto.taxonomy;
      create.taxonomy_id = createAccountDto.taxonomy_id;
      create.title = createAccountDto.title;
      create.translations = createAccountDto?.translations || null;
      create.updated_timestamp = createAccountDto.updated_timestamp;
      create.url = createAccountDto.url;
      create.user = createAccountDto?.user || null;
      // create.userId= createAccountDto.userId
      create.views = createAccountDto?.views || 0;
      create.who_made = createAccountDto.who_made;
      create.when_made = createAccountDto.when_made;
      create.vendor = createAccountDto.vendor;

      create.csvFile = options?.csvFile || null;
      create.message = options?.message || null;
      create.status = options?.status || null;
      create.variationImages = options?.variationImages || null;

      create.deletedAt = null;
      return await this.listing.save(create);
    }
  }
}
