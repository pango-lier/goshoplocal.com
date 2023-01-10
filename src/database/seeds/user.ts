import { User } from 'src/users/entities/user.entity';
import { encodePwd } from '../../utils/bcrypt';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import * as env from 'env-var';

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connect: Connection): Promise<any> {
    console.log('Create User');
    const obUser = {
      active: true,
      name: 'admin',
      username: 'username',
      email: 'admin@gmail.com',
      password: encodePwd(env.get('ADMIN_PASSWORD').asString() || '123456'),
      role: 'super-admin',
    };

    let findUser = await connect
      .getRepository<User>('user')
      .findOneBy({ email: obUser.email });
    if (!findUser)
      findUser = connect.getRepository<User>('user').create(obUser);
    else {
      findUser = { ...findUser, ...obUser };
    }
    await connect.getRepository('user').save(findUser);
  }
}
