import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConnectsService } from './connects.service';
import { CreateConnectDto } from './dto/create-connect.dto';
import { UpdateConnectDto } from './dto/update-connect.dto';
import { Paginate } from 'src/paginate/paginate.decorator';
import { IPaginate } from 'src/paginate/paginate.interface';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('connects')
export class ConnectsController {
  constructor(private readonly connectsService: ConnectsService) {}

  @UseGuards(jwtAuthGuard)
  @Post()
  create(@Body() createConnectDto: CreateConnectDto) {
    return this.connectsService.create(createConnectDto);
  }

  @UseGuards(jwtAuthGuard)
  @Get()
  findAll(@Paginate() filter: IPaginate) {
    return this.connectsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConnectDto: UpdateConnectDto) {
    return this.connectsService.update(+id, updateConnectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.connectsService.remove(+id);
  }
}
