import { Injectable } from '@nestjs/common';
import { CreateConnectDto } from './dto/create-connect.dto';
import { UpdateConnectDto } from './dto/update-connect.dto';

@Injectable()
export class ConnectsService {
  create(createConnectDto: CreateConnectDto) {
    return 'This action adds a new connect';
  }

  findAll() {
    return `This action returns all connects`;
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
