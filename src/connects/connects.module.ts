import { Module } from '@nestjs/common';
import { ConnectsService } from './connects.service';
import { ConnectsController } from './connects.controller';
import { Connect } from './entities/connect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Connect])],
  controllers: [ConnectsController],
  providers: [ConnectsService],
})
export class ConnectsModule {}
