import * as bcrypt from 'bcrypt';

export function encodePwd(rawPassword: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePwd(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
