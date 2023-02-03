import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('mail', () => ({
  mailer: env.get('MAIL_MAILER').asString(),
  host: env.get('MAIL_HOST').asString(),
  port: env.get('MAIL_PORT').asInt(),
  username: env.get('MAIL_USERNAME').asString(),
  password: env.get('MAIL_PASSWORD').asString(),
  encryption: env.get('MAIL_ENCRYPTION').asString(),
  address: env.get('MAIL_FROM_ADDRESS').asString(),
  name: env.get('MAIL_FROM_NAME').asString(),
  toAdmin: env.get('MAIL_ADMIN').asString(),
}));
