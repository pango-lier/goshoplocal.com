import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('fpt-goshoplocal', () => ({
  host: env.get('FPT_FILE_GOSHOPLOCAL_HOST').asString(),
  password: env.get('FPT_FILE_GOSHOPLOCAL_PASSWORD').asString(),
  port: env.get('FPT_FILE_GOSHOPLOCAL_PORT').asString(),
  user: env.get('FPT_FILE_GOSHOPLOCAL_USERNAME').asString(),
  secure: env.get('FPT_FILE_GOSHOPLOCAL_SECURE').asString(),
}));
