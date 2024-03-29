import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EtsyApiService } from './etsy-api.service';
import { CreateEtsyApiDto } from './dto/create-etsy-api.dto';
import { UpdateEtsyApiDto } from './dto/update-etsy-api.dto';

@Controller('etsy-api')
export class EtsyApiController {
  constructor(private readonly etsyApiService: EtsyApiService) {}

  @Post()
  create(@Body() createEtsyApiDto: CreateEtsyApiDto) {
    return this.etsyApiService.create(createEtsyApiDto);
  }

  @Get()
  findAll() {
    return this.etsyApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.etsyApiService.syncAccount(id);
  }

  @Post('sync')
  syncAccount(@Body() body: { id: number }) {
    return this.etsyApiService.syncAccount(body.id);
  }

  @Post('sync/listing')
  syncListing(@Body() body: { id: number }) {
    return this.etsyApiService.syncListing(body.id);
  }

  @Get('listing/csv/:id')
  getListingCsv(@Param('id') id: string) {
    return this.etsyApiService.createListingCsv(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEtsyApiDto: UpdateEtsyApiDto) {
    return this.etsyApiService.update(+id, updateEtsyApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.etsyApiService.remove(+id);
  }
}
