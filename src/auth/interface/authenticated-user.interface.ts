import { User } from 'src/users/entities/user.entity';

export type AuthenticatedUser = Pick<
  User,
  'id' | 'name' | 'username' | 'email'
>;
