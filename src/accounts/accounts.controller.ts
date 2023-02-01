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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Paginate } from 'src/paginate/paginate.decorator';
import { IPaginate } from 'src/paginate/paginate.interface';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(jwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  async findAll(@Paginate() paginate: IPaginate) {
    const [result, total] = await this.accountsService.findAll(paginate);
    return {
      result,
      total,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
