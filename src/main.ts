import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    session({
      secret: 'sdsds',
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 60000 },
    }),
  );
  await app.listen(3000);
}
bootstrap();
