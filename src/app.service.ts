import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UpdateAuthDto } from './auth/dto/update-auth.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { encodePwd } from './utils/bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private userService: UsersService) {}
  async onApplicationBootstrap(): Promise<any> {
    // add a functionality to check if the data already exists, if not add it manually
    this.createUserAdmin();
  }

  async createUserAdmin(): Promise<User> {
    try {
      const userDto = new User();
      userDto.active = true;
      userDto.name = 'admin';
      userDto.username = 'username';
      userDto.email = 'admin@gmail.com';
      userDto.password = encodePwd('123456');
      userDto.active = true;

      await this.userService.repository().upsert(userDto, ['email']);
    } catch (error) {
      console.log(error.message || 'Create user error.');
    }
    return undefined;
  }
}
