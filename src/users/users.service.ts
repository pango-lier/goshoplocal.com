import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IPaginate } from 'src/paginate/paginate.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  paginate(paginate: IPaginate) {
    const query = this.repo.createQueryBuilder('users');
    if (paginate.q) {
      query.where('users.name LIKE :s OR users.id = :q', {
        s: `%${paginate.q}%`,
        q: paginate.q,
      });
    }
    if (paginate.limit) {
      query.limit(paginate.limit);
    }
    if (paginate.offset) {
      query.offset(paginate.offset);
    }
    if (paginate.sort) {
      Object.entries(paginate.sort).forEach((entry) => {
        const [key, value] = entry;
        query.orderBy(key, value as any);
      });
    }
    return query.getManyAndCount();
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
