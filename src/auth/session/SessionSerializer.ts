import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    console.log('serializeUser');
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User) => void) {
    console.log('deserializeUser');
    const userDb = await this.userService.findMe(user.id);
    return userDb ? done(null, userDb) : done(null, null);
  }
}
