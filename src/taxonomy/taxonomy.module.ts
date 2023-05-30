import { Module } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { TaxonomyController } from './taxonomy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Taxonomy } from './entities/taxonomy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Taxonomy])],
  controllers: [TaxonomyController],
  providers: [TaxonomyService],
  exports: [
    TypeOrmModule.forFeature([Taxonomy]),
    TaxonomyService,
    TaxonomyModule,
  ],
})
export class TaxonomyModule {}
