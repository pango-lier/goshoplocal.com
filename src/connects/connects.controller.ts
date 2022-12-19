import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConnectsService } from './connects.service';
import { CreateConnectDto } from './dto/create-connect.dto';
import { UpdateConnectDto } from './dto/update-connect.dto';

@Controller('connects')
export class ConnectsController {
  constructor(private readonly connectsService: ConnectsService) {}

  @Post()
  create(@Body() createConnectDto: CreateConnectDto) {
    return this.connectsService.create(createConnectDto);
  }

  @Get()
  findAll() {
    return this.connectsService.findAll();
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
