import { Injectable } from '@nestjs/common';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto';
import { UpdateTaxonomyDto } from './dto/update-taxonomy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Taxonomy } from './entities/taxonomy.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectRepository(Taxonomy) private readonly taxonomy: Repository<Taxonomy>,
  ) {}
  create(createTaxonomyDto: CreateTaxonomyDto) {
    return 'This action adds a new taxonomy';
  }

  findAll() {
    return `This action returns all taxonomy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taxonomy`;
  }

  update(id: number, updateTaxonomyDto: UpdateTaxonomyDto) {
    return `This action updates a #${id} taxonomy`;
  }

  remove(id: number) {
    return `This action removes a #${id} taxonomy`;
  }

  async findOneOption(
    where: FindOptionsWhere<Taxonomy> | FindOptionsWhere<Taxonomy>[],
  ) {
    return await this.taxonomy.findOneBy(where);
  }
}
