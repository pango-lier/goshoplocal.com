import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import * as expressListRoutes from 'express-list-routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'oauth/verifier', method: RequestMethod.GET }],
  });
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(expressListRoutes({}, 'API:', router));
  await app.listen(4000);
}
bootstrap();
