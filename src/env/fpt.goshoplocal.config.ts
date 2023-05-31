import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('fpt-goshoplocal', () => ({
  isLocal: env.get('IS_FPT_LOCAL').asBool(),
  host: env.get('FPT_FILE_GOSHOPLOCAL_HOST').asString(),
  password: env.get('FPT_FILE_GOSHOPLOCAL_PASSWORD').asString(),
  port: env.get('FPT_FILE_GOSHOPLOCAL_PORT').asString(),
  user: env.get('FPT_FILE_GOSHOPLOCAL_USERNAME').asString(),
  secure: env.get('FPT_FILE_GOSHOPLOCAL_SECURE').asString(),
  folder: env.get('FPT_FILE_GOSHOPLOCAL_FOLDER').asString(),
}));
