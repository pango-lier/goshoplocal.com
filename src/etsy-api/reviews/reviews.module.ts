import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { CoreApiService } from 'src/etsy-api/core-api/core-api.service';
import { ConfigService } from '@nestjs/config';
import { OauthRedisService } from 'src/etsy-api/oauth-redis/oauth-redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService, CoreApiService, OauthRedisService],
})
export class ReviewsModule {}
