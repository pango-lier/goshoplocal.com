import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IPaginate } from 'src/paginate/paginate.interface';
import { PaginateService } from 'src/paginate/paginate.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly paginateService: PaginateService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  async findAll(filter: IPaginate) {
    const query = this.repo.createQueryBuilder('users');
    return await this.paginateService.queryFilter<User>(query, filter);
  }

  findOne(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findMe(me: any) {
    return this.repo.findOneBy([{ id: me }, { email: me }, { username: me }]);
  }

  repository(): Repository<User> {
    return this.repo;
  }
}
