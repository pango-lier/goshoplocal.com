import { Injectable } from '@nestjs/common';
import { CreateConnectDto } from './dto/create-connect.dto';
import { UpdateConnectDto } from './dto/update-connect.dto';
import { IPaginate } from 'src/paginate/paginate.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Connect } from './entities/connect.entity';
import { Repository } from 'typeorm';
import { PaginateService } from 'src/paginate/paginate.service';
import { EnumConnectStatus } from './enum/connect.enum';
const randomstring = require('randomstring');
@Injectable()
export class ConnectsService {
  constructor(
    @InjectRepository(Connect) private readonly repo: Repository<Connect>,
    private readonly paginateService: PaginateService,
  ) {}

  create(createConnectDto: CreateConnectDto) {
    createConnectDto.active = true;
    createConnectDto.status = EnumConnectStatus.WaitingConnect;
    createConnectDto.user_id = 1;
    const date = new Date();
    date.setHours(date.getHours() + 48);
    createConnectDto.expiredAt = date;
    createConnectDto.accessToken =
      randomstring.generate(24) + '_' + new Date().getTime();
    const connect = this.repo.create(createConnectDto);
    return this.repo.save(connect);
  }

  async findAll(filter: IPaginate) {
    const query = this.repo.createQueryBuilder('connect');
    query.leftJoinAndSelect('connect.user', 'user');
    query.leftJoinAndSelect('connect.account', 'account');
    return await this.paginateService.queryFilter<Connect>(query, filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} connect`;
  }

  update(id: number, updateConnectDto: UpdateConnectDto) {
    return `This action updates a #${id} connect`;
  }

  remove(id: number) {
    return `This action removes a #${id} connect`;
  }
}
