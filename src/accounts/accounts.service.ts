import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginateService } from 'src/paginate/paginate.service';
import { IPaginate } from 'src/paginate/paginate.interface';
import { OauthRedisService } from 'src/etsy-api/oauth-redis/oauth-redis.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private account: Repository<Account>,
    private paginateService: PaginateService,
    private readonly oauthRedis: OauthRedisService,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const account = this.account.create(createAccountDto);
    return await this.account.save(account);
  }

  async findAll(paginate: IPaginate) {
    const query = this.account.createQueryBuilder('account');
    query.select([
      'account.id as id',
      'account.active as active',
      'account.createdAt as createdAt',
      'account.etsy_user_id as etsy_user_id',
      'account.name as name',
      'account.image_url_75x75 as image_url_75x75',
      'account.primary_email as primary_email',
      'account.scope as scope',
      'account.shop_id as shop_id',
      'account.shop_name as shop_name',
      'account.status as status',
      'account.vendor as vendor',
      'account.userId as userId',
    ]);

    return await this.paginateService.queryFilter(query, paginate, [
      'account.vendor',
      'account.primary_email',
      'account.shop_id',
      'account.shop_name',
      'account.etsy_user_id',
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  findMany(options: FindOptionsWhere<Account> | FindOptionsWhere<Account>[]) {
    return this.account.findBy(options);
  }

  findEtsyUserId(
    options: FindOptionsWhere<Account> | FindOptionsWhere<Account>[],
  ) {
    return this.account.findOneBy(options);
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.account.findOneBy({ id });
    account.name = updateAccountDto.name;
    account.active = updateAccountDto.active;
    account.primary_email = updateAccountDto.primary_email;
    account.last_name = updateAccountDto?.last_name || null;
    account.first_name = updateAccountDto?.first_name || null;
    if (updateAccountDto.vendor) {
      account.vendor = updateAccountDto.vendor;
      const redisAccount = await this.oauthRedis.getAccountTokens(
        account.etsy_user_id,
      );
      redisAccount.vendor = account.vendor;
      await this.oauthRedis.setRedisToken(redisAccount);
    }

    return await this.account.save(account);
  }

  async sync(createAccountDto: CreateAccountDto) {
    const account = await this.account.findOne({
      where: { etsy_user_id: createAccountDto.etsy_user_id },
      withDeleted: true,
    });
    if (!account) {
      return await this.create(createAccountDto);
    } else {
      account.accessToken = createAccountDto.accessToken;
      account.refreshToken = createAccountDto.refreshToken;
      account.active = true;
      account.primary_email = createAccountDto.primary_email;
      account.last_name = createAccountDto?.last_name || null;
      account.first_name = createAccountDto?.first_name || null;
      account.etsy_user_id = createAccountDto.etsy_user_id;
      account.scope = createAccountDto?.scope || null;
      if (createAccountDto?.vendor) {
        account.vendor = createAccountDto?.vendor || null;
      }

      account.shop_id = createAccountDto.shop_id || null;
      account.deletedAt = null;
      return await this.account.save(account);
    }
  }

  remove(id: number) {
    return this.account.softDelete({ id });
  }
}
