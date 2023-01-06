import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'oauth/verifier', method: RequestMethod.GET }],
  }); //
  await app.listen(4000);
}
bootstrap();
