import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxonomyDto } from './create-taxonomy.dto';

export class UpdateTaxonomyDto extends PartialType(CreateTaxonomyDto) {}
