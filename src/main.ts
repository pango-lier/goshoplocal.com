import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './app/AllExceptionsFilter';
import { ExpressAdapter } from '@bull-board/express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'oauth/verifier', method: RequestMethod.GET }],
  }); //
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // const serverAdapter = new ExpressAdapter();
  // app.use(
  //   '/api/admin/queues',
  //   (req, res, next) => {
  //     console.log(req);
  //     return res.redirect('/home');
  //     next();
  //   },
  //   serverAdapter.getRouter(),
  // );
  await app.listen(4000);
}
bootstrap();
