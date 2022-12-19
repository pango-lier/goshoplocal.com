import { PartialType } from '@nestjs/mapped-types';
import { CreateConnectDto } from './create-connect.dto';

export class UpdateConnectDto extends PartialType(CreateConnectDto) {}
