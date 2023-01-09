import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { PaginateService } from 'src/paginate/paginate.service';
import { IPaginate } from 'src/paginate/paginate.interface';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private account: Repository<Account>,
    private paginateService: PaginateService,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const account = this.account.create(createAccountDto);
    return await this.account.save(account);
  }

  async findAll(paginate: IPaginate) {
    const query = this.account.createQueryBuilder('account');
    query.select('account.*');

    return await this.paginateService.queryFilter(query, paginate, [
      'account.vendor',
      'account.email',
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.account.findOneBy({ id });
    account.name = updateAccountDto.name;
    account.active = updateAccountDto.active;
    account.primary_email = updateAccountDto.primary_email;
    account.last_name = updateAccountDto?.last_name || null;
    account.first_name = updateAccountDto?.first_name || null;
    account.vendor = updateAccountDto.vendor;
    return await this.account.save(account);
  }

  async sync(createAccountDto: CreateAccountDto) {
    const account = await this.account.findOneBy({
      primary_email: createAccountDto.primary_email,
    });
    if (!account) {
      return await this.create(createAccountDto);
    } else {
      account.accessToken = createAccountDto.accessToken;
      account.refreshToken = createAccountDto.refreshToken;
      account.active = createAccountDto.active;
      account.primary_email = createAccountDto.primary_email;
      account.last_name = createAccountDto?.last_name || null;
      account.first_name = createAccountDto?.first_name || null;
      account.etsy_user_id = createAccountDto?.etsy_user_id || null;
      account.scope = createAccountDto?.scope || null;
      account.vendor = createAccountDto?.vendor || null;
      return await this.account.save(account);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
